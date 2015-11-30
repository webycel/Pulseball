'use strict';

var PULSEBALL = (function(document, $) {

	var $table = $('#table'),
		ranking;

	function roundNumber(num) {
		return Math.round(num * 100) / 100;
	}

	function updateTable() {
		var $tableBody = $table.find('tbody'),
			i, row;

		$tableBody.html(''); // reset table

		sortRankingByPoints();

		for (i in ranking) {
			row = '<tr><td>' + ranking[i].pos + '</td><td>' + ranking[i].team.name + '</td><td>' + ranking[i].pts + '</td></tr>';
			$tableBody.append(row);
		}
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

	function addMatch(match) {
		match = JSON.parse(match);

		var homeTeam = getTeam(parseInt(match.teams[0].id)),
			awayTeam = getTeam(parseInt(match.teams[1].id)),
			pointsDifference = getRatingDifference(homeTeam, awayTeam),
			pointsGained;

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
	}

	function init(rankingsJson) {
		if (rankingsJson) {
			ranking = JSON.parse(rankingsJson);
			updateTable();
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
