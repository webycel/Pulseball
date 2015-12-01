'use strict';

var PULSEBALL = (function(document, $) {

	var $table = $('#table'),
		$addMatchForm = $('#add-match'),
		$addMatchFormHome = $addMatchForm.find('#homeTeam'),
		$addMatchFormAway = $addMatchForm.find('#awayTeam'),
		$addMatchFormErrors = $addMatchForm.find('.errors'),
		$matches = $('#matches'),
		ranking,
		matches = [];

	function roundNumber(num) {
		return Math.round(num * 100) / 100;
	}

	function updateTable() {
		var $tableBody = $table.find('tbody'),
			posChange = "-",
			elemClass = "",
			i, $row;

		$tableBody.html(''); // reset table

		sortRankingByPoints();

		for (i in ranking) {
			if (ranking[i].pos < ranking[i].prevPos) {
				posChange = "↑";
				elemClass = "up";
			} else if (ranking[i].pos > ranking[i].prevPos) {
				posChange = "↓";
				elemClass = "down";
			}

			$row = $('<tr></tr>')
						.append(
							'<td class="centered ' + elemClass + '" title="' + ranking[i].prevPos + '">' + posChange + '</td>'
						  + '<td class="centered">' + ranking[i].pos + '</td>'
					      + '<td>' + ranking[i].team.name + '</td>'
						  + '<td>' + ranking[i].pts + '</td>'
						);

			$tableBody.append($row);
		}
	}

	function updatePlayedMatches() {
		var $match,
			lastMatch = matches[matches.length - 1];

		if (lastMatch.status === 'C') {
			$match = '<li>' + lastMatch.teams[0].name + ' ' + lastMatch.scores[0] + ' - ' + lastMatch.scores[1] + ' ' + lastMatch.teams[1].name + '<li>';
			$matches.prepend($match);
		}
	}

	function populateAddMatch() {
		var options = '<option value="-1">Please choose</option>';

		for (var t in ranking) {
			options += '<option value="' + ranking[t].team.id + '">' + ranking[t].team.name + '</option>';
		}

		$addMatchFormHome.html(options);
		$addMatchFormAway.html(options);
	}

	function sortRankingByPoints() {
		var sortedRanking, i,
			sortRule = function(a, b) {
			if (a.pts < b.pts) {
				return -1
			}
			if (a.pts > b.pts) {
				return 1
			}
			return 0;
		};
		sortedRanking = ranking.sort(sortRule).reverse();

		for (i in ranking) {
			ranking[i].prevPos = ranking[i].pos;
			ranking[i].pos = parseInt(i) + 1;
		}

		return sortedRanking;
	}

	function getTeam(teamID) {
		for (var t in ranking) {
			if (ranking[t].team.id === teamID) {
				ranking[t].index = parseInt(t);
				return ranking[t];
			}
		}
	}

	function getRatingDifference(homeTeam, awayTeam) {
		var diff = (homeTeam.pts + 3) - awayTeam.pts;

		if (diff > 10) {
			return 10;
		} else if (diff < -10) {
			return -10;
		}

		return (diff);
	}

	function submitMatch(event) {
		event.preventDefault();

		var homeTeam = parseInt($('#homeTeam').val()),
			awayTeam = parseInt($('#awayTeam').val()),
			homeTeamScore = $('#homeTeamScore').val(),
			awayTeamScore = $('#awayTeamScore').val();

		$addMatchFormErrors.html('').addClass('hidden');

		if (homeTeam === -1 || awayTeam === -1) {
			$addMatchFormErrors.html('Please select a valid team.').removeClass('hidden');
		} else if (homeTeam === awayTeam) {
			$addMatchFormErrors.html('A team can\'t play against themself, duh.').removeClass('hidden');
		} else if (homeTeamScore === "" || awayTeamScore === "") {
			$addMatchFormErrors.html('Please enter a valid score.').removeClass('hidden');
		} else {
			addMatch(buildMatchString(getTeam(homeTeam).team, getTeam(awayTeam).team, homeTeamScore, awayTeamScore));
		}
	}

	function buildMatchString(homeTeam, awayTeam, scoreHome, scoreAway) {
		var match = {
			matchID: 1234,
			description: "Match 3",
			venue: {
				id: 15000,
				name: "Voith Arena",
				city: "Heidenheim",
				country: "Germany"
			},
			teams: [
				{
					id: homeTeam.id,
					name: homeTeam.name
				},
				{
					id: awayTeam.id,
					name: awayTeam.name
				}
			],
			scores: [scoreHome, scoreAway],
			status: "C",
			outcome: getWinner(scoreHome, scoreAway)
		};

		return JSON.stringify(match);
	}

	function getWinner(a, b) {
		if (a > b) {
			return "A";
		} else if (a < b) {
			return "B";
		}
		return "D";
	}

	function addMatch(match) {
		match = JSON.parse(match);

		var homeTeam = getTeam(parseInt(match.teams[0].id)),
			awayTeam = getTeam(parseInt(match.teams[1].id)),
			pointsDifference = getRatingDifference(homeTeam, awayTeam),
			pointsGained;

		matches.push(match);

		if (match.outcome === 'A') { // home team wins
			pointsGained = 1 - (pointsDifference / 10);
			homeTeam.pts = roundNumber(homeTeam.pts + pointsGained);
			awayTeam.pts = roundNumber(awayTeam.pts - pointsGained);
		} else if (match.outcome === 'B') { // away team wins
			pointsGained = 1 + (pointsDifference / 10);
			homeTeam.pts = roundNumber(homeTeam.pts - pointsGained);
			awayTeam.pts = roundNumber(awayTeam.pts + pointsGained);
		} else if (match.outcome === 'D') { // draw
			pointsGained = pointsDifference / 10;
			homeTeam.pts = roundNumber(homeTeam.pts + pointsGained);
			awayTeam.pts = roundNumber(awayTeam.pts + pointsGained);
		}

		updateTable();
		updatePlayedMatches();
	}

	function init(rankingsJson) {
		if (rankingsJson) {
			ranking = JSON.parse(rankingsJson);

			updateTable();
			populateAddMatch();

			$(document).on('click', '#submit-match', submitMatch);
		}
	}

	return {
		init: init,
		addMatch: addMatch
	};

})(document, jQuery);

(function() {
	var rankingsJson = '[{ "team": { "name": "Australia", "id": 32 }, "pos": 1, "pts": 54.23},{ "team": { "name": "New Zealand", "id": 62 }, "pos": 2, "pts":54.00 },{ "team": { "name": "France", "id": 2 }, "pos": 3, "pts": 52.95 }, { "team": { "name": "England", "id": 1 }, "pos": 4, "pts": 52.32 }, { "team": { "name": "Romania", "id": 24 }, "pos": 5, "pts": 43.50 }]';
	var match = '{"matchId": 2524, "description": "Match 2", "venue": {"id": 900,"name": "Stadium", "city": "Paris", "country": "France"}, "teams": [{"id": 2,"name": "France","abbreviation": "FRA" },{"id": 1,"name": "England", "abbreviation": "ENG"} ],"scores": [ 19,23 ],"status": "C","outcome": "B" }';

	PULSEBALL.init(rankingsJson);
	PULSEBALL.addMatch(match);
})();
