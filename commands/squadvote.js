exports.run = async (client, message, args) => {
	if (message.channel.id !== client.config.host_channel_id) {
		// If the command isn't ran in the host channel, do nothing.
		return;
	}

	const message_squad_sizes = args;
	const emojiCharacters = require('../emojiCharacters.js');
	const host_channel = client.channels.get(client.config.host_channel_id);
	const games_channel = client.channels.get(client.config.games_channel_id);
	let error_message;

	// Set up the message as an embed, ready to post
	const title = 'Vote for squad size!';
	const description = 'Please vote on the squad size for the next game';
	const winText = 'The winning squad size is:';
	const footerText = '© DanBennett';

	// Function to compare two arrays
	function containsAny(source, target) {
		const result = source.filter(function(item) {
			return target.indexOf(item) > -1;
		});
		return result.length > 0;
	}

	const squadVoteMessage = {
		color: 0x3366ff,
		title: `${title}`,
		description: `${description}`,
		fields: [
			{
				name: 'Choose a reaction',
				value:
					'Click the reaction for the amount of players in each squad you want.',
			},
			{
				name: 'Vote will close in:',
				value: `${client.config.default_timer} minute(s)`,
			},
		],
		timestamp: new Date(),
		footer: {
			icon_url: client.user.avatarURL,
			text: `${footerText}`,
		},
	};

	if (message_squad_sizes.length == 0) {
		// If the array is empty, only vote for 1, 2, 4 or 8.
		try {
			await games_channel
				.send({ embed: squadVoteMessage })
				.then(async embedMessage => {
					await embedMessage.react(emojiCharacters[1]);
					await embedMessage.react(emojiCharacters[2]);
					await embedMessage.react(emojiCharacters[4]);
					await embedMessage.react(emojiCharacters[8]);
					setTimeout(function() {
						const reactions = embedMessage.reactions.array();
						let reactionID;
						let maxCount = 0;
						for (let i = 0; i < reactions.length; i++) {
							if (reactions[i].count > maxCount) {
								maxCount = reactions[i].count;
								reactionID = i;
							}
						}
						const squadResultEmoji = reactions[reactionID]._emoji;

						const squadResult = {
							color: 0x009900,
							title: `${title}`,
							fields: [
								{
									name: `${winText}`,
									value: `${squadResultEmoji}`,
								},
							],
							timestamp: new Date(),
							footer: {
								icon_url: client.user.avatarURL,
								text: `${footerText}`,
							},
						};

						embedMessage.delete();
						games_channel.send({ embed: squadResult });
						if (client.config.host_channel_messages === true) {
							host_channel.send(
								`${winText} ${reactions[reactionID]._emoji}`
							);
						}
					}, client.config.default_timer * 60 * 1000);
				});
		}
		catch (error) {
			console.log(`${error}`);
		}
	}
	else if (message_squad_sizes[0] == 'all') {
		// If the array is 'all' - post up to 10
		try {
			await games_channel
				.send({ embed: squadVoteMessage })
				.then(async embedMessage => {
					await embedMessage.react(emojiCharacters[1]);
					await embedMessage.react(emojiCharacters[2]);
					await embedMessage.react(emojiCharacters[3]);
					await embedMessage.react(emojiCharacters[4]);
					await embedMessage.react(emojiCharacters[5]);
					await embedMessage.react(emojiCharacters[6]);
					await embedMessage.react(emojiCharacters[7]);
					await embedMessage.react(emojiCharacters[8]);
					await embedMessage.react(emojiCharacters[9]);
					await embedMessage.react(emojiCharacters[10]);
					setTimeout(function() {
						const reactions = embedMessage.reactions.array();
						let reactionID;
						let maxCount = 0;
						for (let i = 0; i < reactions.length; i++) {
							if (reactions[i].count > maxCount) {
								maxCount = reactions[i].count;
								reactionID = i;
							}
						}
						const squadResultEmoji = reactions[reactionID]._emoji;

						const squadResult = {
							color: 0x009900,
							title: `${title}`,
							fields: [
								{
									name: `${winText}`,
									value: `${squadResultEmoji}`,
								},
							],
							timestamp: new Date(),
							footer: {
								icon_url: client.user.avatarURL,
								text: `${footerText}`,
							},
						};

						embedMessage.delete();
						games_channel.send({ embed: squadResult });
						if (client.config.host_channel_messages === true) {
							host_channel.send(
								`${winText} ${reactions[reactionID]._emoji}`
							);
						}
					}, client.config.default_timer * 60 * 1000);
				});
		}
		catch (error) {
			console.log(`${error}`);
		}
	}
	else if (isNaN(message_squad_sizes[0])) {
		// If it's not a number...
		error_message = 'Error: Please only use numbers!';
		host_channel.send(error_message);
		return;
	}
	else {
		// Picked squad sizes by host
		// Check the array fits in the range we want
		const squads_range = [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
		];
		const squads_correct_range = containsAny(
			squads_range,
			message_squad_sizes
		);

		if (squads_correct_range === false) {
			host_channel.send('A number is out of range');
		}
		else {
			try {
				await games_channel
					.send({ embed: squadVoteMessage })
					.then(async embedMessage => {
						for (let i = 0; i < message_squad_sizes.length; i++) {
							await embedMessage.react(
								emojiCharacters[message_squad_sizes[i]]
							);
						}
						setTimeout(function() {
							const reactions = embedMessage.reactions.array();
							let reactionID;
							let maxCount = 0;
							for (let i = 0; i < reactions.length; i++) {
								if (reactions[i].count > maxCount) {
									maxCount = reactions[i].count;
									reactionID = i;
								}
							}

							const squadResultEmoji =
								reactions[reactionID]._emoji;

							const squadResult = {
								color: 0x009900,
								title: `${title}`,
								fields: [
									{
										name: `${winText}`,
										value: `${squadResultEmoji}`,
									},
								],
								timestamp: new Date(),
								footer: {
									icon_url: client.user.avatarURL,
									text: `${footerText}`,
								},
							};

							embedMessage.delete();
							games_channel.send({ embed: squadResult });
							if (client.config.host_channel_messages === true) {
								host_channel.send(
									`${winText} ${reactions[reactionID]._emoji}`
								);
							}
						}, client.config.default_timer * 60 * 1000);
					});
			}
			catch (error) {
				console.log(`${error}`);
			}
		}
	}
};
