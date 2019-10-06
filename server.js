var http = require("http");
var fs = require("fs");
var url = require("url");

var json = fs.readFileSync("./data.json");
var template = fs.readFileSync("./templates/product.html");
var cardsTemplate = fs.readFileSync("./templates/card.html") + "";
var overviewTemplate = fs.readFileSync("./templates/overview.html") + "";
template = template + "";

json = JSON.parse(json);

function replace(template, product)
{
	template = template.replace(/#image#/g, product["image"]);
	template = template.replace(/#Productname#/g, product["productName"]);
	template = template.replace(/#From#/g, product["from"]);
	template = template.replace(/#Nutrients#/g, product["nutrients"]);
	template = template.replace(/#Quantity#/g, product["quantity"]);
	template = template.replace(/#Price#/g, product["price"]);
	template = template.replace(/#Description#/g, product["description"]);
	template = template.replace(/#id#/g, product["id"])
	if(!product["organic"])
	{
		template = template.replace(/#not-organic#/g, "not-organic")
	}
	return template;
}
// console.log(json);

var server = http.createServer(function(req, res)	
{
	// console.log(url.parse(req.url,true));
	var parsedUrl = url.parse(req.url, true);
	var pathName = parsedUrl.pathname;
	var id = parsedUrl.query.id;
	console.log(pathName)
	if (req.url == "/homePage" || req.url == "/" || req.url == "") 
	{
		// res.write("");
		var cards = "";
		for (var i = 0; i < json.length; i++) 
			cards = cards + replace(cardsTemplate, json[i]);

		overviewTemplate = overviewTemplate.replace(/{%cardsarea%}/g, cards);
		res.write(overviewTemplate);  
	}

	else if (pathName == "/product") 
	{
		var productPage = replace(template, json[id]);
		res.write(productPage);
	}

	else if (req.url == "/api") 
	{
		res.write(json);
	}

	else 
	{
		res.write("<h1>404 Page Not found</h1>");
	}

	res.end();
});

server.listen(3000, function() 
{
	console.log("Server is listening at port 3000");
});
