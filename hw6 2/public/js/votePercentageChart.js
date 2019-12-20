/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
	        text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
	    });

	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult){


   			  // ******* TODO: PART III *******


        let thisClass = this, cummSum = 0,  voteText = []

        let firstElement = electionResult[0]

		let	rPercent = parseFloat(firstElement["R_PopularPercentage"].replace('%','')),
			dPercent = parseFloat(firstElement["D_PopularPercentage"].replace('%',''))

        let iPercent = firstElement["I_PopularPercentage"].replace('%','')
		iPercent = iPercent == "" ? 0:parseFloat(iPercent)

        if(iPercent > 0){
            voteText.push({party:"I",votePercentageText:firstElement["I_PopularPercentage"], votePercentage:iPercent,
                votesCount:firstElement["I_Votes_Total"], nominee:firstElement["I_Nominee_prop"], pos:0})
        }
        if(dPercent > 0){
            voteText.push({party:"D",votePercentageText:firstElement["D_PopularPercentage"], votePercentage:dPercent,
                votesCount:firstElement["D_Votes_Total"], nominee:firstElement["D_Nominee_prop"], pos:iPercent+20})
        }
        if(rPercent > 0){
            voteText.push({party:"R",votePercentageText:firstElement["R_PopularPercentage"], votePercentage:rPercent,
				votesCount:firstElement["R_Votes_Total"], nominee:firstElement["R_Nominee_prop"],pos:iPercent+dPercent+rPercent})
        }


        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,200];
            })
            .html((d)=> {
                /* populate data in the following format */
                // tooltip_data = {
                // "result":[
                // {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
                // {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
                // {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
                // ]
                // }
                /*
                * pass this as an argument to the tooltip_render function then,
                * return the HTML content returned from that method.
                * */
                let tipData = []
                voteText.forEach(function (d)
                {
                    tipData.push({
                        "nominee": d.nominee,
                        "votecount": d.votesCount,
                        "percentage": d.votePercentageText,
                        "party": d.party
                    });
                })
                return thisClass.tooltip_render({"result":tipData});
            });

        let vis = d3.select(document.body)
            .append('svg')
            .attr('width', 50)
            .attr('height', 50)
            .append('g')
            .attr('transform', 'translate(20, 20)')
            .call(tip)

        let xScale = d3
            .scaleLinear()
            .domain([0, iPercent + rPercent + dPercent])
            .range([0, thisClass.svgWidth]);

        let rect =
            this.svg
                .selectAll("rect")
                .data(voteText)

        rect.exit().remove()

        rect = rect
            .enter()
            .append("rect")
            .merge(rect)

        rect
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr("x",function (d) {
                let currX = cummSum
                cummSum = cummSum + parseFloat(d.votePercentage)
                return xScale(currX)
            })
            .attr("y",70)
            .attr("width", function (d) {
                return xScale(parseFloat(d.votePercentage));
            })
            .attr("height", 20 )
            .attr("class",function (d) {
                return thisClass.chooseClass(d.party)

            })
			.classed("votesPercentage",true)

        this.svg
            .append("rect")
            .attr("x",this.svgWidth/2)
            .attr("y",67)
            .attr("width", 2)
            .attr("height", 26 )
            .attr("stroke", "black")
             .classed("middlePoint",true)

        this.svg
            .append("text")
            .attr("x",this.svgWidth/2)
            .attr("y",50)
            .attr("width",10)
            .text("Popular Vote (50%)")
            .classed("electoralVoteStatic",true)

        let voteDisp =
            this.svg
                .selectAll(".votesNomineeText")
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
            .attr("y",35)
            .text(function (d) {
                return d.nominee
            })
            .attr("class",function (d) {
                return thisClass.chooseClass(d.party)

            })
            .classed("votesNomineeText",true)

        let votePercentDisp =
            this.svg
                .selectAll(".votesPercentageText")
                .data(voteText)

        votePercentDisp.exit().remove()

        votePercentDisp =
            votePercentDisp
                .enter()
                .append("text")
                .merge(votePercentDisp)


        votePercentDisp
            .attr("x",function (d) {
                return xScale(d.pos)

            })
            .attr("y",65)
            .text(function (d) {
                return d.votePercentageText
            })
            .attr("class",function (d) {
                return thisClass.chooseClass(d.party)

            })
            .classed("votesPercentageText",true)



		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.

		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}