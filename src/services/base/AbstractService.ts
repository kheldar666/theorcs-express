import { Service } from "./Service";
import { $log } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";

export abstract class AbstractService<T, K extends MongooseModel<T>>
  implements Service<T, K>
{
  async findById(id: string): Promise<T> {
    $log.debug({ Context: "AbstractService.findById", id: id });

    const data = await this.model.findById(id);
    if (data) {
      $log.debug({
        Context: "AbstractService.findById",
        message: "Object found",
        object: data,
      });
      return data;
    }
    throw new NotFound("Data not found");
  }

  async save(object: T): Promise<T> {
    $log.debug({ Context: "AbstractService.save", user: object });

    const model = new this.model(object);
    $log.debug({ Context: "AbstractService.save", message: "Saving Object" });
    await model.updateOne(object, { upsert: true });

    $log.debug({ Context: "AbstractService.save", message: "Object saved" });

    return model;
  }

  async findOne(predicate: Partial<T>): Promise<T> {
    $log.debug({ Context: "AbstractService.findOne", predicate: predicate });
    // @ts-ignore
    const aUser = await this.model.findOne(predicate);
    if (aUser) {
      $log.debug({ Context: "AbstractService.findOne", result: aUser });
      return aUser;
    }
    throw new NotFound("Object not found");
  }

  abstract initData(): Promise<void>;

  abstract get model(): K;
}
