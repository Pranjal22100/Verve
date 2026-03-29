import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "verve",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "verve-group" });

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};