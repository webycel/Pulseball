'use strict';

describe('Pulseball', function () {

	var testRankingTable,
		testRankingTableWithPrevPos,
		testRankingHomeWin,
		testRankingAwayWin,
		testRankingDraw,
		testMatchHomeWin,
		testMatchAwayWin,
		testMatchDraw;

	beforeEach(function() {
		testRankingTable = '[{ "team": { "name": "Australia", "id": 32 }, "pos": 1, "pts": 54.23},{ "team": { "name": "New Zealand", "id": 62 }, "pos": 2, "pts":54.00 },{ "team": { "name": "France", "id": 2 }, "pos": 3, "pts": 52.95 }, { "team": { "name": "England", "id": 1 }, "pos": 4, "pts": 52.32 }, { "team": { "name": "Romania", "id": 24 }, "pos": 5, "pts": 43.50 }]';
		testRankingTableWithPrevPos = '[{"team":{"name":"Australia","id":32},"pos":1,"pts":54.23,"prevPos":1},{"team":{"name":"New Zealand","id":62},"pos":2,"pts":54,"prevPos":2},{"team":{"name":"France","id":2},"pos":3,"pts":52.95,"prevPos":3},{"team":{"name":"England","id":1},"pos":4,"pts":52.32,"prevPos":4},{"team":{"name":"Romania","id":24},"pos":5,"pts":43.5,"prevPos":5}]';

		testRankingHomeWin = '[{"team":{"name":"Australia","id":32},"pos":1,"pts":54.23,"prevPos":1},{"team":{"name":"New Zealand","id":62},"pos":2,"pts":54,"prevPos":2},{"team":{"name":"France","id":2},"pos":3,"pts":53.59,"prevPos":3,"index":2},{"team":{"name":"England","id":1},"pos":4,"pts":51.68,"prevPos":4,"index":3},{"team":{"name":"Romania","id":24},"pos":5,"pts":43.5,"prevPos":5}]';
		testRankingAwayWin = '[{"team":{"name":"Australia","id":32},"pos":1,"pts":54.23,"prevPos":1},{"team":{"name":"New Zealand","id":62},"pos":2,"pts":54,"prevPos":2},{"team":{"name":"England","id":1},"pos":3,"pts":53.17,"prevPos":4,"index":3},{"team":{"name":"France","id":2},"pos":4,"pts":52.1,"prevPos":3,"index":2},{"team":{"name":"Romania","id":24},"pos":5,"pts":43.5,"prevPos":5}]';
		testRankingDraw = '[{"team":{"name":"Australia","id":32},"pos":1,"pts":54.23,"prevPos":1},{"team":{"name":"New Zealand","id":62},"pos":2,"pts":54,"prevPos":2},{"team":{"name":"England","id":1},"pos":3,"pts":53.36,"prevPos":3,"index":2},{"team":{"name":"France","id":2},"pos":4,"pts":52.29,"prevPos":4,"index":3},{"team":{"name":"Romania","id":24},"pos":5,"pts":43.5,"prevPos":5}]';

		testMatchHomeWin = '{"matchId": 2524, "description": "Match 2", "venue": {"id": 900,"name": "Stadium", "city": "Paris", "country": "France"}, "teams": [{"id": 2,"name": "France","abbreviation": "FRA" },{"id": 1,"name": "England", "abbreviation": "ENG"} ],"scores": [ 25,23 ],"status": "C","outcome": "A" }';
		testMatchAwayWin = '{"matchId": 2524, "description": "Match 2", "venue": {"id": 900,"name": "Stadium", "city": "Paris", "country": "France"}, "teams": [{"id": 2,"name": "France","abbreviation": "FRA" },{"id": 1,"name": "England", "abbreviation": "ENG"} ],"scores": [ 19,23 ],"status": "C","outcome": "B" }';
		testMatchDraw = '{"matchId": 2524, "description": "Match 2", "venue": {"id": 900,"name": "Stadium", "city": "Paris", "country": "France"}, "teams": [{"id": 2,"name": "France","abbreviation": "FRA" },{"id": 1,"name": "England", "abbreviation": "ENG"} ],"scores": [ 19,19 ],"status": "C","outcome": "D" }';
	});

	it("should accept a ranking table and add previous positions", function() {
		PULSEBALL.init(testRankingTable);
		var ranking = JSON.stringify(PULSEBALL.getRanking());

		expect(ranking).toEqual(testRankingTableWithPrevPos);
	});

	it("should add a match with home win and update the ranking", function() {
		PULSEBALL.addMatch(testMatchHomeWin);
		var ranking = JSON.stringify(PULSEBALL.getRanking());

		expect(ranking).toEqual(testRankingHomeWin);
	});

	it("should add a match with away win and update the ranking", function() {
		PULSEBALL.addMatch(testMatchAwayWin);
		var ranking = JSON.stringify(PULSEBALL.getRanking());

		expect(ranking).toEqual(testRankingAwayWin);
	});

	it("should add a draw match and update the ranking", function() {
		PULSEBALL.addMatch(testMatchDraw);
		var ranking = JSON.stringify(PULSEBALL.getRanking());

		expect(ranking).toEqual(testRankingDraw);
	});

});
