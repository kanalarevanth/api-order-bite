import { Schema } from 'mongoose';

export enum Status {
	active = 'active',
	inactive = 'inactive',
	deleted = 'deleted',
}

export type DataStatus = 'active' | 'deleted' | 'inactive';

export type CommonSchemaProps<T> = Partial<{
	createdBy: string | T;
	updatedBy: string | T;
	deletedBy: string | T;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
	status: DataStatus;
}>;

export const mongooseSchemaProps = (userCollectionName: string = 'User') => ({
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: userCollectionName,
	},
	updatedBy: {
		type: Schema.Types.ObjectId,
		ref: userCollectionName,
	},
	deletedBy: {
		type: Schema.Types.ObjectId,
		ref: userCollectionName,
	},
	deletedAt: Date,
	status: {
		type: String,
		enum: Status,
		default: Status.active,
	},
});

export const mongooseSchemaOptions = {
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
	collation: {
		locale: 'en_US',
		numericOrdering: true,
	},
};
