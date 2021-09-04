import { MongooseModel } from "@tsed/mongoose";

export interface Service<T, K extends MongooseModel<T>> {
  initData(): Promise<void>;

  get model(): K;
}
