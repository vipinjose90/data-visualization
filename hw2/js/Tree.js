/** Class representing a Tree. */
class Tree {

	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */
	constructor(json) {
        this.tree = []
		for (let elem of json){
            this.tree.push(new Node(elem.name,elem.parent))
		}
		
	}


	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */

	buildTree() {
        for (let currentNode of this.tree){
            for (let checkChild of this.tree){
                if (currentNode.name === checkChild.parentName){
                    currentNode.addChild(checkChild)
                    checkChild.parentNode = currentNode
                }
            }
            if(currentNode.parentName=== "root"){
                var rootNode = currentNode
            }
        }

<<<<<<< HEAD
	//Assign Positions and Levels by making calls to assignPosition() and assignLevel()
        this.assignLevelPosition(rootNode,0,{})
=======
        //Assign Positions and Levels by making calls to assignPosition() and assignLevel()
    }
>>>>>>> 98b86b26aac115ffda6b2d59581f0233a4e178aa

	}

	/**
	 * Recursive function that assign levels and position to each node
	 */
	assignLevelPosition(node, level, positionTrack) {
        if (positionTrack[level] === undefined){
            if (node.parentName ==="root"){
                positionTrack[level] = 0
            }
            else{
                positionTrack[level] = node.parentNode.position
            }
        }
        else{
            positionTrack[level] += 1
        }
        if(node.children.length === 0){
            node.position = positionTrack[level]
            node.level = level
            return
        }
        else{
            node.level = level
            node.position = positionTrack[level]
            for(let current of node.children){
                this.assignLevelPosition(current,level+1,positionTrack)
            }
        }
	}

	/**
	 * Function that renders the tree
	 */
	renderTree() {
<<<<<<< HEAD
        let scale = 190
        let offset = 50
        let radius = 42

        let render = d3.select("body")
            .append("svg")
            .attr("width", 1200)
            .attr("height", 1300)

        let selection = d3.select("svg")
            .selectAll("circle")
            .data(this.tree)


        selection
            .enter()
            .append("line")
            .attr("x1", function (d) {
                if (d.parentName === "root") {
                    return 0
                }
                else {
                    return d.parentNode.level * scale + offset
                }
            })
            .attr("y1", function (d, i) {
                if (d.parentName === "root") {
                    return 0
                }
                else {
                    return d.parentNode.position * scale + offset
                }
            })
            .attr("x2", function (d) {
                if (d.parentName === "root") {
                    return 0
                }
                else {
                    return d.level * scale + offset
                }
            })
            .attr("y2", function (d, i) {
                if (d.parentName === "root") {
                    return 0
                }
                else {
                    return d.position * scale + offset
                }
            })

        selection
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return d.level * scale + offset
            })
            .attr("cy", function (d) {
                if (d.parentName === "root") {
                    return offset
                }
                else {
                    return d.position * scale + offset
                }
            })
            .attr("r", radius)

        selection
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.level * scale + offset
            })
            .attr("y", function (d) {
                if (d.parentName === "root") {
                    return offset
                }
                else {
                    return d.position * scale + offset
                }
            })
            .attr("class", "label")
            .text(function (d) {
                return d.name
            })

    }
		
=======
        
    }

>>>>>>> 98b86b26aac115ffda6b2d59581f0233a4e178aa
}