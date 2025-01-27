import { model, Document, Schema, Model } from 'mongoose';
import { CommonSchemaProps, mongooseSchemaProps, mongooseSchemaOptions } from '../helpers/common-props';
import { deletePrivateProps } from '../helpers/private-props';

export interface IUser
	extends Partial<Document>,
		CommonSchemaProps<IUser>,
		DeepPartial<{
			firstName: string;
			lastName: string;
			avatar: string;
			thumb: string;
			email: string;
			password: string;
			sessions: string[];
		}> {}

export interface IUserModel extends Model<IUser> {
	deletePrivateProps(data: IUser, deleteStatus?: boolean): IUser;
}

const UserSchema = new Schema<IUser, IUserModel>(
	{
		firstName: String,
		lastName: String,
		avatar: String,
		thumb: String,
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: String,
		sessions: [String],
		...mongooseSchemaProps('User'),
	},
	{
		...mongooseSchemaOptions,
	},
);

UserSchema.statics.deletePrivateProps = (data: IUser, deleteStatus = true) => {
	deletePrivateProps(data, deleteStatus);
	delete data.sessions;
	delete data.password;
	return data;
};

UserSchema.index(
	{
		status: 1,
	},
	{
		name: 'main',
	},
);

UserSchema.index(
	{
		firstName: 'text',
		lastName: 'text',
		email: 'text',
	},
	{
		name: 'search',
		collation: {
			locale: 'simple',
		},
	},
);

export const UserModel = model<IUser, IUserModel>('User', UserSchema);

UserModel.syncIndexes().catch((err) => {});
