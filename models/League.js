const mongoose = require('mongoose');
mongoose.Promise = mongoose.Promise = global.Promise;

const leagueSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		index: true,
		required: true,
		auto: true
	},
	name: {
		type: String,
		trim: true,
		required: 'Please enter a League name.'
	},
	description: {
		type: String,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	mods: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	members: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	open: {
		type: Boolean,
		default: false
	}
});

leagueSchema.index({
	_id: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('League', leagueSchema);