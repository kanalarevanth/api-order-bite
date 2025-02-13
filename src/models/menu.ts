import { model, Document, Schema, Model } from 'mongoose';
import { CommonSchemaProps, mongooseSchemaProps, mongooseSchemaOptions } from './helpers/common-props';
import { deletePrivateProps } from './helpers/private-props';
import { IAdminUser } from './users/admin-users';
import { IRestaurant } from './restaurants';

enum categoryEnum {
	'main course' = 'main course',
	'dessert' = 'dessert',
}

const MenuItemSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			enum: Object.values(categoryEnum),
			required: true,
		},
		availability: {
			type: Boolean,
			default: true,
		},
		image: {
			type: String,
		},
	},
	{
		_id: false,
	},
);

export interface IRestaurantMenu extends Partial<Document>, CommonSchemaProps<IAdminUser> {
	veg: (typeof MenuItemSchema)[];
	nonVeg: (typeof MenuItemSchema)[];
	specialItems: (typeof MenuItemSchema)[];
	beverages: (typeof MenuItemSchema)[];
	restaurant: string | IRestaurant;
}

export interface IRestaurantMenuModel extends Model<IRestaurantMenu> {
	deletePrivateProps(data: IRestaurantMenu, deleteStatus?: boolean): IRestaurantMenu;
}

const RestaurantMenuSchema = new Schema<IRestaurantMenu, IRestaurantMenuModel>(
	{
		veg: {
			type: [MenuItemSchema],
			default: [],
		},
		nonVeg: {
			type: [MenuItemSchema],
			default: [],
		},
		specialItems: {
			type: [MenuItemSchema],
			default: [],
		},
		beverages: {
			type: [MenuItemSchema],
			default: [],
		},
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

RestaurantMenuSchema.statics.deletePrivateProps = (data: IRestaurantMenu, deleteStatus = true) => {
	deletePrivateProps(data, deleteStatus);
	return data;
};

RestaurantMenuSchema.index(
	{
		status: 1,
	},
	{
		name: 'main',
	},
);

RestaurantMenuSchema.index(
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

export const RestaurantMenuModel = model<IRestaurantMenu, IRestaurantMenuModel>('RestaurantMenu', RestaurantMenuSchema);

RestaurantMenuModel.syncIndexes().catch((err) => {});
