// =============================================================================
// Event Bus Service - RabbitMQ Implementation
// =============================================================================

import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { v4 as uuidv4 } from "uuid";

export type EventHandler<T = any> = (event: DomainEvent<T>) => Promise<void>;

export class EventBusService {
  private static instance: EventBusService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private handlers: Map<string, EventHandler[]> = new Map();
  private serviceName: string;
  private exchangeName = "capstone_events";
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  public static getInstance(serviceName: string): EventBusService {
    if (!EventBusService.instance) {
      EventBusService.instance = new EventBusService(serviceName);
    }
    return EventBusService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      const url = process.env.RABBITMQ_URL || "amqp://localhost";
      console.log(`🔌 [${this.serviceName}] Connecting to RabbitMQ at ${url}...`);
      
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      // Assert the exchange exists (Topic exchange for flexibility)
      await this.channel.assertExchange(this.exchangeName, "topic", {
        durable: true,
      });

      // Assert a durable queue for this specific service
      const queueName = `${this.serviceName}_queue`;
      await this.channel.assertQueue(queueName, {
        durable: true,
      });

      this.isConnected = true;
      console.log(`✅ [${this.serviceName}] Connected to RabbitMQ`);

      // Handle connection closure
      this.connection.on("close", () => {
        console.error(`❌ [${this.serviceName}] RabbitMQ connection closed`);
        this.isConnected = false;
        this.handleDisconnect();
      });

      this.connection.on("error", (err) => {
        console.error(`❌ [${this.serviceName}] RabbitMQ connection error:`, err);
        this.isConnected = false;
        this.handleDisconnect();
      });

      // Start processing messages
      await this.startConsuming(queueName);

    } catch (error) {
      console.error(`❌ [${this.serviceName}] Failed to connect to RabbitMQ:`, error);
      this.handleDisconnect();
    }
  }

  private async handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`🔄 [${this.serviceName}] Retrying connection in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error(`❌ [${this.serviceName}] Max reconnection attempts reached. Exiting...`);
      process.exit(1);
    }
  }

  public async publish<T>(
    eventName: EventNames,
    payload: T,
    correlationId?: string
  ): Promise<void> {
    if (!this.channel) {
      console.warn(`⚠️ [${this.serviceName}] Cannot publish event ${eventName}: No connection`);
      return;
    }

    const event: DomainEvent<T> = {
      eventId: uuidv4(),
      eventName,
      timestamp: new Date(),
      payload,
      correlationId: correlationId || uuidv4(),
    };

    try {
      const routingKey = eventName; // Use event name as routing key
      const sent = this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        {
          persistent: true, // Make message persistent
          messageId: event.eventId,
          timestamp: event.timestamp.getTime(),
          appId: this.serviceName,
          type: eventName,
        }
      );

      if (sent) {
        console.log(`📤 [${this.serviceName}] Published event: ${eventName}`);
      } else {
        console.warn(`⚠️ [${this.serviceName}] Event ${eventName} buffer full, message may be lost`);
      }
    } catch (error) {
      console.error(`❌ [${this.serviceName}] Error publishing event:`, error);
    }
  }

  public async subscribe<T>(
    eventName: EventNames,
    handler: EventHandler<T>
  ): Promise<void> {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);

    if (this.channel && this.isConnected) {
      const queueName = `${this.serviceName}_queue`;
      // Bind the queue to the exchange with the specific routing key (event name)
      await this.channel.bindQueue(queueName, this.exchangeName, eventName);
      console.log(`📥 [${this.serviceName}] Subscribed to: ${eventName}`);
    }
  }

  private async startConsuming(queueName: string) {
    if (!this.channel) return;

    await this.channel.consume(
      queueName,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const content = JSON.parse(msg.content.toString());
          const event = content as DomainEvent;
          const handlers = this.handlers.get(event.eventName);

          if (handlers && handlers.length > 0) {
            console.log(`🔹 [${this.serviceName}] Processing event: ${event.eventName}`);
            
            // Execute all handlers
            await Promise.all(handlers.map((handler) => handler(event)));
            
            // Acknowledge message if successful
            this.channel!.ack(msg);
          } else {
            // If no handlers but we received it, it might be a misconfiguration or intended ignore
            // We ack it to remove from queue so it doesn't block
            // console.debug(`[${this.serviceName}] No handler for ${event.eventName}, ignoring.`);
            this.channel!.ack(msg); 
          }
        } catch (error) {
          console.error(`❌ [${this.serviceName}] Error processing message:`, error);
          // Reject message and do not requeue (dlx strategy could be used here)
          this.channel!.nack(msg, false, false);
        }
      },
      {
        noAck: false, // We use manual acknowledgments
      }
    );
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
      console.log(`🛑 [${this.serviceName}] Disconnected from RabbitMQ`);
    } catch (error) {
      console.error(`Error disconnecting RabbitMQ:`, error);
    }
  }
}
