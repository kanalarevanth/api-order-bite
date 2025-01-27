export const deletePrivateProps = (object, deleteStatus = true) => {
	if (deleteStatus) {
		delete object.status;
	}
	delete object.createdBy;
	delete object.updatedBy;
	delete object.deletedBy;
	delete object.createdAt;
	delete object.updatedAt;
	delete object.deletedAt;
	return object;
};
