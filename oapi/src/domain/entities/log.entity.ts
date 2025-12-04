export interface LogEntity {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  service: string;
  module: string;
  context?: Record<string, any>;
  createdAt: Date;
}
