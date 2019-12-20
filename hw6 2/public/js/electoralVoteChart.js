   
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;
        
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)

    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){

          // ******* TODO: PART II *******

        let thisClass = this, cummSum = 0, eWinners = [], iWinners = [], allParticipants = [], voteText = []

        let toto = d3.sum(electionResult,function (d) {
            return parseFloat(d.Total_EV)
        })

        let xScale = d3
            .scaleLinear()
            .domain([0, toto])
            .range([0, thisClass.svgWidth]);

        let rSum = d3.sum(electionResult,function (d) {
            return parseFloat(d["RD_Difference"]) > 0 ? parseFloat(d.Total_EV):0
        })

        let dSum = d3.sum(electionResult,function (d) {
            return parseFloat(d["RD_Difference"]) < 0 ? parseFloat(d.Total_EV):0
        })

        let iSum = d3.sum(electionResult,function (d) {
            return parseFloat(d["RD_Difference"]) == 0 ? parseFloat(d.Total_EV):0
        })

        if(rSum > 0){
            voteText.push({party:"R",pos:rSum+dSum+iSum,value:rSum})
        }
        if(dSum > 0){
            voteText.push({party:"D",pos:iSum,value:dSum})
        }
        if(iSum > 0){
            voteText.push({party:"I",pos:0,value:iSum})
        }


    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

        for (let element of electionResult){
            if(parseFloat(element["RD_Difference"])!=0){
                eWinners.push(element)
            }
            else{
                iWinners.push(element)
            }
        }

        eWinners.sort(function(a, b) {
            return parseFloat(a["RD_Difference"]) - parseFloat(b["RD_Difference"]);
        });

        allParticipants = iWinners.concat(eWinners)


        let rect =
            this.svg
                .selectAll("rect")
                .data(allParticipants)

        rect.exit().remove()

        rect = rect
            .enter()
            .append("rect")
            .merge(rect)

        rect
            .attr("x",function (d) {
                let currX = cummSum
                cummSum = cummSum + parseFloat(d["Total_EV"])
                return xScale(currX)
            })
            .attr("y",25)
            .attr("width", function (d) {

                return xScale(parseFloat(d["Total_EV"]));
            })
            .attr("height", 20 )
            .attr("fill",function (d) {
                return parseFloat(d["RD_Difference"])!=0 ? colorScale(d["RD_Difference"]):"green";
            })
            .classed("electoralVotes",true)

        this.svg
            .append("rect")
            .attr("x",this.svgWidth/2)
            .attr("y",22)
            .attr("width", 2)
            .attr("height", 26 )
            .attr("stroke", "black")
            .classed("middlePoint",true)

        this.svg
            .append("text")
            .attr("x",this.svgWidth/2)
            .attr("y",10)
            .attr("width",10)
            .text("Electoral Vote (270 needed to win)")
            .classed("electoralVoteStatic",true)

        let voteDisp =
            this.svg
                .selectAll(".electoralVoteText")
                .data(voteText)

        voteDisp.exit().remove()

        voteDisp =
            voteDisp
                .enter()
                .append("text")
                .merge(voteDisp)


        voteDisp
            .attr("x",function (d) {
                return xScale(d.pos)

            })
            .attr("y",20)
            .text(function (d) {
                return d.value
            })
            .attr("class",function (d) {
                return thisClass.chooseClass(d.party)

            })
            .classed("electoralVoteText",true)



    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.


    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
        let brush = d3.brushX().extent([[0,21],[this.svgWidth,49]]).on("end", function () {
            let cumSum = 0
            let currentSelection = d3.event.selection
            let brushArray = []
            allParticipants.forEach(function (d) {
                let curX = cumSum
                cumSum = cumSum + parseFloat(d["Total_EV"])
                if(xScale(curX + parseFloat(d["Total_EV"])) >= currentSelection[0] && xScale(curX) <= currentSelection[1]){
                    brushArray.push(d)
                }
            })
            thisClass.shiftChart.update(brushArray,null)
        });
    //Implement a call back method to handle the brush end event.
        this.svg.append("g").attr("class", "brush").call(brush);
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


    };

    
}
