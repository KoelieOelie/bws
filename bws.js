class BWS {
    #elm;
    #canvas;
    #ctx;
    #output;
    constructor(elm) {
        this.#elm=elm;
        this.#canvas=document.createElement("canvas");
        this.#canvas.width = 794;
        this.#canvas.height = 288;
        this.#ctx=this.#canvas.getContext("2d");
        this.#elm.appendChild(this.#canvas);
        this.#output = document.createElement("ul");
        this.#elm.appendChild(this.#output);
        let wisdom = new FontFace("wisdom", "url('Wisdom Script AJ.otf')");
        let erdwin = new FontFace("erdwin", "url('Edwin-Italic.otf')");
        Promise.all([wisdom.load(), erdwin.load()]).then(loaded => {
            loaded.forEach(font => document.fonts.add(font));
            window.postMessage("loaded");
            this.#ctx.textAlign = "center";
            this.#ctx.font = "35pt wisdom";
            this.#ctx.fillText("Wachten op een bestand...", this.#canvas.width / 2, this.#canvas.height / 2);
        });
    }
    readFile(file){
        if (file.name.endsWith(".bws")) {
            //file.
            var reader = new FileReader();
            reader.onload = (event) => {
                this.#parseFile(event.target.result);
            };
            reader.readAsText(file);
        }else{
            this.#parseFile(false);
        }
    }
    #parseFile(file){
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        if (file!=false) {
            this.#output.innerHTML='';
            file = file.replaceAll("\r\n", "\n");
            file = file.split("\n");
            console.log(file);
            var sheet = [];
            var i = 0;
            var headers = { in: 'bw' };
            for (let index = 0; index < file.length; index++) {

                var element = file[index];
                if (element.startsWith("ti:") || element.startsWith("st:") || element.startsWith("in:")) {
                    element = file[index].split(":");
                    headers[element[0]] = element[1];
                } else {
                    var element = file[index];
                    i++;
                    var row = document.createElement("li");
                    if (i % 2 == 1) {
                        if (element != "") {
                            var items = element.replaceAll(" ", "").split("|");
                            console.log(items);
                            items.forEach(element => {
                                var tmp = document.createElement("canvas");
                                tmp.height = 49;
                                tmp.width = 171;
                                var ctx = tmp.getContext("2d");
                                ctx.font = "15pt erdwin";
                                ctx.fillText(element, 10, 35);
                                row.appendChild(tmp);
                            });

                        }
                    } else {
                        if (element.charAt(0) != "-") {
                            element = "|" + element;
                        }
                        element = element + "!"
                        for (let cell = 0; cell < element.length; cell++) {
                            var tmp = document.createElement("img");
                            switch (element.charAt(cell).toLowerCase()) {
                                case "|":
                                    tmp.src = "I_AA.svg";
                                    break;
                                case " ":
                                    tmp.src = "I_AB.svg";
                                    break;
                                case "!":
                                    tmp.src = "I_AC.svg";
                                    break;
                                case "-":
                                    tmp.src = "I_J.svg";
                                    if (element.charAt(cell + 1) != "-") {
                                        row.appendChild(tmp);
                                        tmp = document.createElement("img");
                                        tmp.src = "I_AA.svg";
                                    }
                                    break;
                                case "~":
                                    tmp.src = "I_I.svg";
                                    break;
                                case "r":
                                    tmp.src = "I_R.svg";
                                    break;
                                default:
                                    tmp.setAttribute("data-src", `I_${(element.charAt(cell)).toUpperCase()}`);
                                    //tmp.src = "I_" + (element.charAt(cell)).toUpperCase() + ".svg";
                                    break;
                            }
                            row.appendChild(tmp);

                        }
                    }
                    this.#output.appendChild(row);
                    sheet.push([i % 2, element]);
                }


                //console.log(element);




            }
            var logo = new Image()
            logo.src = `Logo_${headers["in"]}.png`;
            logo.onload = () => {
                this.#ctx.drawImage(logo, 0, 0, 192, 288);
            };
            this.#output.querySelectorAll('[data-src]').forEach(function (elm) {
                elm.src = `${elm.getAttribute("data-src")}.${headers["in"]}.svg`;
            });

            this.#ctx.textAlign = "center";
            this.#ctx.font = "35pt wisdom";
            this.#ctx.fillText(headers.ti, 220 + 220, 170);
            if (typeof headers.st != "undefined") {
                this.#ctx.font = "25pt wisdom";

                this.#ctx.fillText(headers.st, 220 + 220, 215);
            }
            console.log(headers);
            console.log(sheet);
        }else{
            this.#ctx.textAlign = "center";
            this.#ctx.font = "35pt wisdom";
            this.#ctx.fillText("Kon bestand niet openen!", this.#canvas.width / 2, this.#canvas.height / 2);
        }
        
    }
    load_file(filename){
        fetch(filename).then((resp)=>{
            if (resp.status!=200) {
                return false;
            }            
            return resp.text();
        }).then((resp) => { this.#parseFile(resp)});
        
    }

}