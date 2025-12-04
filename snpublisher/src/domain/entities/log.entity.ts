export interface LogEntity {
  id: string;
  traceId: string;
  createdAt: Date;
  level: "info" | "warn" | "error";
  message: string;
  context?: Record<string, any>;
  service: string;
  module: string;
}
