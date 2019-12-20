/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        let gameScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d.value.TotalGames;
            })])
            .range([0,this.cell.width -this.cell.buffer])

        let aggregateColorScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d.value.TotalGames;
            })])
            .range(['#ece2f0', '#016450'])


        let goalScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d3.max([d.value["Goals Made"],d.value["Goals Conceded"]]);
            })])
            .range([this.cell.buffer,this.cell.width*2 - this.cell.buffer])

        this.aggregateColorScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d.value.TotalGames;
            })])
            .range(['#ece2f0', '#016450'])

        this.goalColorScale = d3.scaleQuantize()
            .domain([-1,1])
            .range(['#cb181d', '#034e7b'])



        // Create the x axes for the goalScale.
        let xAxis =d3.axisTop()
            .scale(goalScale)
            .ticks(10);

        //add GoalAxis to header of col 1.
        d3.select("#goalHeader")
            .append("svg")
            .attr("width",this.cell.width*2 )
            .attr("height",this.cell.height)
            .append("g")
            .attr("transform", "translate(0," + (this.cell.height - 1) + ")")
            .call(xAxis);

        // ******* TODO: PART V *******
        let thisClass = this
        // Set sorting callback for clicking on headers
        d3.select("thead")
            .selectAll("td,th")
            .on("click", function() {
                thisClass.collapseList();
                let descSort = d3.select(this).classed("descending");

                let sortOn = d3.select(this).text();

                thisClass.tableElements.sort(function(m, n) {
                    let sign;
                    if (sortOn == "Goals") {
                        sign = (n.value["Delta Goals"] - m.value["Delta Goals"]);
                    } else if (sortOn == "Wins") {
                        sign = (n.value["Wins"] - m.value["Wins"]);
                    } else if (sortOn == "Losses") {
                        sign = (n.value["Losses"] - m.value["Losses"]);
                    } else if (sortOn == "Total Games") {
                        sign = (n.value["TotalGames"] - m.value["TotalGames"]);
                    } else if (sortOn == "Round/Result") {
                        sign = (n.value["Result"].ranking - m.value["Result"].ranking);
                    }
                   else if (sortOn == "Team") {
                        if (descSort == true) {
                            if (n.key <= m.key)
                            {
                                return -1 ;
                            }
                            else
                            {
                                return 1;
                            }
                        }
                        else {
                            if (m.key <= n.key) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        }
                    }


                    if (!descSort)
                        return sign;
                    else
                        return (sign * -1);

                });

                d3.select(this).classed("descending",!descSort);

                thisClass.updateTable();
})}


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        let tab = d3.select("#matchTable>tbody")
            .selectAll("tr").data(this.tableElements)

            tab.exit().remove()

            tab = tab.enter().append("tr")
                .merge(tab)


        //Append th elements for the Team Names
        let rows = tab.selectAll("th")
            .data(function(d) {
                if(d.value.type=="game") {
                    return [{type: "game", vis: "text", value: d.key}]
                }
                else {
                    return [{type: "aggregate", vis: "text", value: d.key}]
                }
            })

        rows.exit().remove();

        rows = rows.enter().append("th")
            .merge(rows)

        let thisClass = this
        let treeClass = this.tree




        rows
            .text(function (d) {
                if(d.type == "game") {
                    return "x" + d.value
                }
                else{
                    return d.value
                }
            })
            .classed("aggregate",function (d) {
                return d.type == "aggregate"
            })
            .classed("game",function (d) {
                return d.type == "game"
            })
            .on("click",function (d) {
                thisClass.updateList(this.parentNode.rowIndex-2)
            })



        d3.select("#matchTable>tbody")
            .selectAll("tr")
            .data(this.tableElements)
            .on("mouseenter", function (d) {
                treeClass.updateTree(thisClass.tableElements,this.rowIndex-2)
            })
            .on("mouseleave", function(d) {
                treeClass.clearTree();
            });







        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        rows = tab.selectAll("td")
            .data(function(d) {
                let cells = []
                if(d.value.type=="game") {
                    cells.push({type: "game", vis: "goals", value: [d.value["Goals Made"], d.value["Goals Conceded"]]})
                    cells.push({type: "game", vis: "text", value: d.value.Result.label})
                    cells.push({type: "game", vis: "bar", value: null})
                    cells.push({type: "game", vis: "bar", value: null})
                    cells.push({type: "game", vis: "bar", value: null})
                }
                else{
                    cells.push({type: "aggregate", vis: "goals", value: [d.value["Goals Made"], d.value["Goals Conceded"]]})
                    cells.push({type: "aggregate", vis: "text", value: d.value.Result.label})
                    cells.push({type: "aggregate", vis: "bar", value: d.value.Wins})
                    cells.push({type: "aggregate", vis: "bar", value: d.value.Losses})
                    cells.push({type: "aggregate", vis: "bar", value: d.value.TotalGames})
                }

                    return cells
                }
            )
            .on("click",function (d) {
                thisClass.updateList(this.parentNode.rowIndex-2)
            })


        rows.exit().remove();

        rows = rows.enter().append("td")
            .merge(rows)

        let bars = rows.filter(function (d) {
            return d["vis"] == 'bar'
        })
            .selectAll("svg")
            .data(function (d) {
                return [d.value]
            })

        bars.exit().remove()

        bars = bars.enter().append("svg")
            .attr("width",this.cell.width)
            .attr("height",this.cell.height)
            .merge(bars)


        let gameScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d.value.TotalGames;
            })])
            .range([0,this.cell.width -this.cell.buffer])

        let aggregateColorScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d.value.TotalGames;
            })])
            .range(['#ece2f0', '#016450'])

        let bars2 = bars.selectAll("rect")
            .data(function(d) { return [d]; });


        bars2.exit().remove();

        bars2.attr("x",0)
            .attr("y",0)
            .attr("width", function (d) { return gameScale([d]); })
            .attr("height", this.cell.height )
            .attr("fill",function(d) { return aggregateColorScale(d); });


        bars2.enter()
            .append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width", function (d) { return gameScale(d); })
            .attr("height", this.cell.height )
            .attr("fill",function(d) { return aggregateColorScale(d); });

        let textdisp = bars.selectAll("text")
            .data(function(d) { return [d]; });

        textdisp.exit().remove();

        textdisp.attr("x",function (d) {
            return (gameScale([d])-1)
        })
            .attr("y",this.cell.height/2 + 3)
            .classed("label",true)
            .attr("height", this.cell.height )
            .attr("text-anchor", "end")
            .text(function (d) {
                return d
            })

        textdisp.enter()
            .append("text")
            .attr("x",function (d) {
                return (gameScale([d])-1)
            })
            .attr("y",this.cell.height/2 + 3)
            .classed("label",true)
            .attr("height", this.cell.height )
            .attr("text-anchor", "end")
            .text(function (d) {
                return d
            })



        let goalColorScale = d3.scaleQuantize()
            .domain([-1,1])
            .range(['#cb181d', '#034e7b'])

        let goalScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,function (d) {
                return d3.max([d.value["Goals Made"],d.value["Goals Conceded"]]);
            })])
            .range([this.cell.buffer,this.cell.width*2 - this.cell.buffer-7])

        let goals = rows.filter(function (d) {
            return d["vis"] == 'goals'
        })
            .selectAll("svg")
            .data(function (d) {
                return [d]
            })

        goals.exit().remove()

        goals = goals.enter().append("svg")
            .attr("width",this.cell.width*2-this.cell.buffer)
            .attr("height",this.cell.height)
            .merge(goals)


        let goalbar = goals.selectAll("rect")
            .data(function(d) { return [d]; });

        goalbar.exit().remove();

        goalbar.attr("x",function (d) {
            return d.value[0]<d.value[1]?goalScale(d.value[0]):goalScale(d.value[1])
        })
            .attr("y",function (d) {
                if(d.type =="aggregate"){
                    return thisClass.cell.height/3.4
                }
                else{
                    return thisClass.cell.height/2.4
                }


            })
            .attr("width", function (d) {
                return (Math.abs(goalScale(d.value[0])-goalScale(d.value[1])))
            })
            .attr("height", function (d) {
                if(d.type =="aggregate"){
                    return thisClass.cell.height/1.8
                }
                else{
                    return thisClass.cell.height/4
                }

            } )
            .attr("fill",function(d) { return (goalColorScale(Math.sign(d.value[0]-d.value[1]))); })
            .classed("goalBar",true);

        goalbar.enter()
            .append("rect")
            .attr("x",function (d) {
                return d.value[0]<d.value[1]?goalScale(d.value[0]):goalScale(d.value[1])
            })
            .attr("y",this.cell.height/3.4)
            .attr("width", function (d) {
                return (Math.abs(goalScale(d.value[0])-goalScale(d.value[1])))
            })
            .attr("height", this.cell.height/1.8 )
            .attr("fill",function(d) { return (goalColorScale(Math.sign(d.value[0]-d.value[1]))); })
            .classed("goalBar",true);


        let goalcircle = goals.selectAll("circle")
            .data(function(d) {
                if(d.value[0]==d.value[1]){
                    return [{"type":d.type,"color":"#b1b1b1","value":d.value[0]}]
                }
                else{
                    return [
                        {"type":d.type,"color":"#364e74","value":d.value[0]},
                        {"type":d.type,"color":"#be2714","value":d.value[1]}
                    ]
                }
            });

        goalcircle.exit().remove();

        goalcircle.attr("cx",function (d) {
            return goalScale(d["value"])
        })
            .attr("cy",this.cell.height/1.8)
            .attr("fill",function (d) {
                if(d["type"]=="aggregate"){
                    return d["color"]
                }
                else{
                    return "#ffffff"
                }
            })
            .attr("stroke",function (d) {
                return d["color"]
            })
            .classed("goalCircle",true)

        goalcircle.enter()
            .append("circle")
            .attr("cx",function (d) {
                return goalScale(d["value"])
            })
            .attr("cy",this.cell.height/1.8)
            .attr("fill",function (d) {
                if(d["type"]=="aggregate"){
                    return d["color"]
                }
                else{
                    return "#ffffff"
                }
            })
            .attr("stroke",function (d) {
                return d["color"]
            })
            .classed("goalCircle",true)



        let textcont = rows.filter(function (d) {
            return d["vis"] == 'text'
        })
            .selectAll("svg")
            .data(function (d) {
                return [d.value]
            })

        textcont.exit().remove()

        textcont = textcont.enter().append("svg")
            .attr("width",this.cell.width*2)
            .attr("height",this.cell.height)
            .merge(textcont)

        let textout = textcont.selectAll("text")
            .data(function(d) { return [d]; });

        textout.exit().remove();

        textout.attr("x",0)
            .attr("y",this.cell.height/2 + 4)
            .classed("node",true)
            .attr("height", this.cell.height )
            .text(function (d) {
                return d
            })

        textout.enter()
            .append("text")
            .attr("x",0)
            .attr("y",this.cell.height/2 + 3)
            .classed("node",true)
            .attr("height", this.cell.height )
            .text(function (d) {
                return d
            })




        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        if (this.tableElements[i].value.type == "game"){
            return
        }
            if(this.tableElements[i+1].value.type == "aggregate"){
            this.tableElements.splice.apply(this.tableElements, [i+1,0].concat(this.tableElements[i].value.games));
        }
        else{
            this.tableElements.splice(i+1,this.tableElements[i].value.games.length);
        }
        this.updateTable()
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        // ******* TODO: PART IV *******
        this.tableElements = this.tableElements.filter(function(d){
            return d.value.type != "game";
        })


    }


}
