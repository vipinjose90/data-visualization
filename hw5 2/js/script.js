/*    /!**
     * Loads in the table information from fifa-matches.json 
     *!/
d3.json('data/fifa-matches.json',function(error,data){

    /!**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     *!/
    d3.csv("data/fifa-tree.csv", function (error, csvData) {

        //Create a unique "id" field for each game
        csvData.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree(data)
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();
    });
});*/


// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
    d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

        /**
         * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
         *
         */
        d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

        // ******* TODO: PART I *******

        let teamData = d3.nest()
            .key(function (d) {
                return d.Team;
            })
            .rollup(function (leaves) {
                let out1 = {
                    "Goals Made":d3.sum(leaves,function(l){return l["Goals Made"]}),
                    "Goals Conceded":d3.sum(leaves,function(l){return l["Goals Conceded"]}),
                    "Delta Goals":d3.sum(leaves,function(l){return l["Delta Goals"]}),
                    "Wins":d3.sum(leaves,function(l){return l["Wins"]}),
                    "Losses":d3.sum(leaves,function(l){return l["Losses"]}),
                    "TotalGames":d3.sum(leaves,function(l){return 1}),
                    "type": "aggregate",
                    "games":
                    d3.nest()
                        .key(function (d) {
                        return d.Opponent;
                    })
                    .rollup(function (lowleaves) {
                        return {
                            "Goals Made": d3.sum(lowleaves, function (l) {
                                return l["Goals Made"]
                            }),
                            "Goals Conceded": d3.sum(lowleaves, function (l) {
                                return l["Goals Conceded"]
                            }),
                            "Delta Goals": d3.sum(lowleaves, function (l) {
                                return l["Delta Goals"]
                            }),
                            "Wins": [],
                            "Losses": [],
                            "type": "game",
                            "Result":
                                {
                                    "ranking":(lowleaves.map(function (d) {
                                        if(d.Result =="Group")
                                            return 0
                                        if(d.Result =="Round of Sixteen")
                                            return 1
                                        if(d.Result =="Quarter Finals")
                                            return 2
                                        if(d.Result =="Semi Finals")
                                            return 3
                                        if(d.Result =="Fourth Place")
                                            return 4
                                        if(d.Result =="Third Place")
                                            return 5
                                        if(d.Result =="Runner-Up")
                                            return 6
                                        if(d.Result =="Winner")
                                            return 7
                                    }))[0],
                                    "label":(lowleaves.map(function (d) {
                                        return d.Result
                                    }))[0]
                                },
                            "Opponent": (lowleaves.map(function (d) {
                                return d.Team
                            }))[0]

                        }})
                        .entries(leaves)



            }
            //console.log(out1)
            return out1
            })
            .entries(matchesCSV);
        
            teamData.forEach(function (d,i) {
                let maxval = -Infinity
                let maxind = ""
                d.value.games.forEach(function(d1,i1){
                    if(d1.value.Result.ranking>maxval){
                        maxval = d1.value.Result.ranking
                        maxind = d1.value.Result.label
                    }
                })
                d.value.Result = {"ranking" : maxval, label:maxind}
            })


            treeCSV.forEach(function (d, i) {
                d.id = d.Team + d.Opponent + i;
            });

            //Create Tree Object
            let tree = new Tree(teamData)
            tree.createTree(treeCSV);

            //Create Table Object and pass in reference to tree object (for hover linking)
            let table = new Table(teamData,tree);

            table.createTable();
            table.updateTable();
        });


    });

 // ********************** END HACKER VERSION ***************************
