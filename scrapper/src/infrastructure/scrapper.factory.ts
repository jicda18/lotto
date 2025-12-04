import {
  GetSourceAResultsUseCase,
  GetSourceBResultsUseCase,
} from "./use-cases";

export const ScrapperFactory = {
  sourceA: GetSourceAResultsUseCase,
  sourceB: GetSourceBResultsUseCase,
};

export type FactoryScrapper = typeof ScrapperFactory;
