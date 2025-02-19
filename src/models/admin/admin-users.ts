import { model, Document, Schema, Model } from 'mongoose';
import { CommonSchemaProps, mongooseSchemaProps, mongooseSchemaOptions } from '../helpers/common-props';
import { deletePrivateProps } from '../helpers/private-props';
import { IRestaurant } from './restaurants';

export interface IAdminUser
	extends Partial<Document>,
		CommonSchemaProps<IAdminUser>,
		DeepPartial<{
			firstName: string;
			lastName: string;
			avatar: string;
			thumb: string;
			email: string;
			password: string;
			sessions: string[];
			restaurant: string | IRestaurant;
		}> {}

export interface IAdminUserModel extends Model<IAdminUser> {
	deletePrivateProps(data: IAdminUser, deleteStatus?: boolean): IAdminUser;
}

const AdminUserSchema = new Schema<IAdminUser, IAdminUserModel>(
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
		restaurant: {
			type: Schema.Types.ObjectId,
			ref: 'Restaurant',
		},
		...mongooseSchemaProps('AdminUser'),
	},
	{
		...mongooseSchemaOptions,
	},
);

AdminUserSchema.statics.deletePrivateProps = (data: IAdminUser, deleteStatus = true) => {
	deletePrivateProps(data, deleteStatus);
	delete data.sessions;
	delete data.password;
	return data;
};

AdminUserSchema.index(
	{
		status: 1,
	},
	{
		name: 'main',
	},
);

AdminUserSchema.index(
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

export const AdminUserModel = model<IAdminUser, IAdminUserModel>('AdminUser', AdminUserSchema);

AdminUserModel.syncIndexes().catch((err) => {});
