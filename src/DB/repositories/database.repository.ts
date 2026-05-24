import {
  Model,
  CreateOptions,
  HydratedDocument,
  RootFilterQuery,
  ProjectionType,
  QueryOptions,
  PopulateOptions,
  UpdateQuery,
  MongooseUpdateQueryOptions,
  UpdateWriteOpResult,
} from "mongoose";

export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  
   // Find Many

  async find({
    filter = {},
    select,
    options,
  }: {
    filter?: RootFilterQuery<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }): Promise<HydratedDocument<TDocument>[]> {
    const query = this.model.find(filter);

    if (select) query.select(select);
    if (options?.populate) query.populate(options.populate as PopulateOptions[]);
    if (options?.lean) query.lean(options.lean);

    return await query.exec();
  }


   //Find One

  async findOne({
    filter = {},
    select,
    options,
  }: {
    filter?: RootFilterQuery<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }): Promise<HydratedDocument<TDocument> | null> {
    const query = this.model.findOne(filter, select || undefined, options || undefined);

    if (options?.populate)
      query.populate(options.populate as PopulateOptions[]);

    if (options?.lean) query.lean(options.lean);

    return await query.exec();
  }


    async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument>[] | undefined> {
    return await this.model.create(data, options);
  }

  /*
    Update One
   */
  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(
      filter,
      { ...update, $inc: { __v: 1 } },
      options || {}
    );
  }

  /**
   *  Delete One
   */
  async deleteOne(
    filter: RootFilterQuery<TDocument>,
    options?: Record<string, any>
  ): Promise<any> {
    return await this.model.deleteOne(filter, options);
  }
}



// import {
//   Model,
//   CreateOptions,
//   HydratedDocument,
//   RootFilterQuery,
//   ProjectionType,
//   QueryOptions,
//   PopulateOptions,
//   UpdateQuery,
//   MongooseUpdateQueryOptions,
//   UpdateWriteOpResult,
// } from "mongoose";

// export abstract class DatabaseRepository<TDocument> {
//   constructor(protected readonly model: Model<TDocument>) {}
// async find({
//   filter = {},
//   select,
//   options,
// }: {
//   filter?: RootFilterQuery<TDocument>;
//   select?: ProjectionType<TDocument> | null;
//   options?: QueryOptions<TDocument> | null;
// }): Promise<HydratedDocument<TDocument>[]> {
//   const query: any = this.model.find(filter);
  
//   if (select) {
//     query.select(select);
//   }
  
//   if (options?.populate) {
//     query.populate(options.populate);
//   }
  
//   if (options?.lean) {
//     query.lean(options.lean);
//   }
  
//   return await query.exec();
// }
//   async findOne({
//     filter,
//     select,
//     options,
//   }: {
//     filter?: RootFilterQuery<TDocument>;
//     select?: ProjectionType<TDocument> | null;
//     options?: QueryOptions<TDocument> | null;
//   }): Promise<HydratedDocument<TDocument> | null> {
//     let doc = this.model.findOne(filter, options).select(select || "");

//     if(options?.populate){
//       doc = doc.populate(options.populate as PopulateOptions[]);
//     }
//     if (options?.lean) {
//       doc.lean(options.lean);
//     }
//     return await doc.exec();
//   }

//   async updateOne({
//     filter,
//     update,
//     options,
//   }:{
//     filter: RootFilterQuery<TDocument>;
//     update: UpdateQuery<TDocument>;
//     options?: MongooseUpdateQueryOptions<TDocument> | null;
//   }): Promise<UpdateWriteOpResult>{
//     return await this.model.updateOne(
//       filter,
//       {...update, $inc: {__v: 1}},
//       options
//     );
//   } 

//   async deleteOne(
//   filter:RootFilterQuery<TDocument>,
//   options?: Record<string, any>
// ): Promise<any> {
//   return await this.model.deleteOne(filter, options);
// }

// }