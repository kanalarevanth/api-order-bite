import { model, Document, Schema, Model } from 'mongoose';
import { CommonSchemaProps, mongooseSchemaProps, mongooseSchemaOptions } from '../helpers/common-props';
import { deletePrivateProps } from '../helpers/private-props';
import { IAdminUser } from './admin-users';
import { IRestaurantMenu } from './menu';
export interface IRestaurant
	extends Partial<Document>,
		CommonSchemaProps<IAdminUser>,
		DeepPartial<{
			name: string;
			logoThumb: string;
			logo: string;
			address: {
				country: string;
				state: string;
				city: string;
				area: string;
				pinCode: string;
			};
			menu: (string | IRestaurantMenu)[];
		}> {}

export interface IRestaurantModel extends Model<IRestaurant> {
	deletePrivateProps(data: IRestaurant, deleteStatus?: boolean): IRestaurant;
}

const RestaurantSchema = new Schema<IRestaurant, IRestaurantModel>(
	{
		name: String,
		logoThumb: String,
		logo: String,
		address: {
			country: String,
			state: String,
			city: String,
			area: String,
			pinCode: String,
		},
		menu: [
			{
				type: Schema.Types.ObjectId,
				ref: 'RestaurantMenu',
			},
		],
		...mongooseSchemaProps('AdminUser'),
	},
	{
		...mongooseSchemaOptions,
	},
);

RestaurantSchema.statics.deletePrivateProps = (data: IRestaurant, deleteStatus = true) => {
	deletePrivateProps(data, deleteStatus);
	return data;
};

RestaurantSchema.index(
	{
		status: 1,
	},
	{
		name: 'main',
	},
);

RestaurantSchema.index(
	{
		name: 'text',
	},
	{
		name: 'search',
		collation: {
			locale: 'simple',
		},
	},
);

export const RestaurantModel = model<IRestaurant, IRestaurantModel>('Restaurant', RestaurantSchema);

RestaurantModel.syncIndexes().catch((err) => {});
