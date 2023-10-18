const userSchema = new mongoose.Schema({
	name: String,
	fixedDeposit: Number,
	interest: Number,
	tenure: Number
});

const User = mongoose.model('User', userSchema);

User.aggregate([{
	$project:
		{ name: 1, fixedDeposit: 1, interest: 1, tenure: 1 }
}])
	.addFields({
		oneMonthReturn:
			{ $multiply: ["$fixedDeposit", "$interest", 1] }
	}).exec((error, success) => {
		if (error)
			console.log(error);
		else
			console.log(success);
	})