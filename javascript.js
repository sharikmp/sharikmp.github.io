function prettyPrintJson() {
	try {
		var json = document.getElementById("menu");
		var jsonPretty = JSON.stringify(JSON.parse(json.value), null, 2);
		json.value = jsonPretty;
	} catch (e) {
		alert('Invalid Json!');
	}
}

function getItemDetails() {
	var x = document.getElementById("menu");
	obj = JSON.parse(x.value);
	var text = "<hr>Menu details<br/><br/><br/>";
	var itemCount = 0;

	/********* LOOP TO FETCH MENU DETAILS **********/
	for (i = 0; i < obj.length; i++) {
		/*********GET STORE DETAILS **********/
		text += "StoreID: " + obj[i].StoreID + "<br/><br/>";
		text += "CatalogName: " + obj[i].CatalogName + "</br><br/>";
		/*********GET CHANNEL **********/
		if (obj[i].ChannelId === "3") {
			text += "Channel: Zomato" + "</br><br/>";
		} else if (obj[i].ChannelId === "4") {
			text += "Channel: Swiggy" + "</br><br/>";
		}
		/*********GET CATAGORIES DETAILS **********/
		for (j = 0; j < obj[i].Categories[0].SubCategories.length; j++) {
			text += "<br/><hr>";
			text += "Catagory Name:\t\t" + obj[i].Categories[0].SubCategories[j].Name + "<br/>";
			text += "Catagory Id:\t\t" + obj[i].Categories[0].SubCategories[j].Id + "<br/>";
			text += "<hr><br/>";
			/*********GET ITEMS DETAILS **********/
			for (k = 0; k < obj[i].Categories[0].SubCategories[j].Items.length; k++) {
				var ItemID = obj[i].Categories[0].SubCategories[j].Items[k].ItemID;
				text += "ItemID: " + ItemID + "</br><br/>";
				var ItemName = obj[i].Categories[0].SubCategories[j].Items[k].ItemName;
				text += "ItemName: " + ItemName + "</br><br/>";
				var Price = obj[i].Categories[0].SubCategories[j].Items[k].Price;
				text += "Price: " + Price + "</br><br/>";
				var Quantity = obj[i].Categories[0].SubCategories[j].Items[k].Quantity;
				text += "Quantity: " + Quantity + "</br><br/>";
				if (k != (obj[i].Categories[0].SubCategories[j].Items.length - 1)) {
					text += "<hr><br/>";
				}
				itemCount++;
			}
		}
	}
	document.getElementById("details").innerHTML = text;
}


function generateSingleItemPayloads() {
	var ele_orderId = document.getElementById("orderId");
	var order_id = 123456;
	if (ele_orderId.value === "" || ele_orderId.value === null || Number.isNaN(ele_orderId.value)) {
		order_id = 123456;
	} else {
		order_id = ele_orderId.value;
	}
	var x = document.getElementById("menu");
	obj = JSON.parse(x.value);
	var text = "<hr>Single Item payloads<br/><br/><br/>";
	var itemCount = 0;

	/********* LOOP TO FETCH MENU DETAILS **********/
	for (i = 0; i < obj.length; i++) {
		/*********GET STORE DETAILS **********/
		text += "StoreID: " + obj[i].StoreID + "<br/><br/>";
		text += "CatalogName: " + obj[i].CatalogName + "</br><br/>";
		/*********GET CHANNEL **********/
		if (obj[i].ChannelId === "3") {
			text += "Channel: Zomato" + "</br><br/>";
		} else if (obj[i].ChannelId === "4") {
			text += "Channel: Swiggy" + "</br><br/>";
		}
		/*********GET CATAGORIES DETAILS **********/
		for (j = 0; j < obj[i].Categories[0].SubCategories.length; j++) {
			text += "<br/><hr>";
			text += "Catagory Name:\t\t" + obj[i].Categories[0].SubCategories[j].Name + "<br/>";
			text += "Catagory Id:\t\t" + obj[i].Categories[0].SubCategories[j].Id + "<br/>";
			text += "<hr><br/><br/><br/>";
			/*********GET ITEMS DETAILS **********/
			for (k = 0; k < obj[i].Categories[0].SubCategories[j].Items.length; k++) {
				var ItemID = obj[i].Categories[0].SubCategories[j].Items[k].ItemID;
				var ItemName = obj[i].Categories[0].SubCategories[j].Items[k].ItemName;
				var Price = obj[i].Categories[0].SubCategories[j].Items[k].Price;
				var Quantity = 1;
				var json = '{' +
					'"order_id": ' + order_id + ',' +
					'"outlet_id": ' + obj[i].StoreID + ',' +
					'"payment_type": "Online",' +
					'"delivery_type": "PICKUP",' +
					'"customer_name": "SWIGGY",' +
					'"order_date_time": "' + getDateTime() + '",' +
					'"restaurant_gross_bill": ' + Price + ',' +
					'"items": [' +
					'{' +
					'"id": "' + ItemID + '",' +
					'"name": "' + ItemName + '",' +
					'"price": ' + Price + ',' +
					'"quantity": ' + Quantity + ',' +
					'"subtotal": ' + (Price * Quantity) + ',' +
					'"sgst": 12, "cgst_percent": 10, "reward_type": null,"addons": [], "cgst": 12,"variants": [],"igst": 0, "sgst_percent": 10, "igst_percent": 0, "packing_charges": 0' +
					'}' +
					'],' +
					'"instructions":"lastorder","order_packing_charges":0,"order_cess_charges":{"keralafloodcess":0,"cess2name":0},"order_cess_expressions":{"keralafloodcess":0,"cess2name":0},"cart_cgst":40,"cart_sgst":40,"cart_igst":0,"cart_gst":80,"cart_cgst_percent":0,"cart_igst_percent":0,"cart_sgst_percent":0,"cart_gst_percent":0,"restaurant_service_charges":0,"restaurant_discount":0,"order_type":"regular","order_edit":false,"order_edit_reason":null,"is_thirty_mof":false,"callback_url":"http://localhost:8098/external/order/confirm"' +
					'}';
				var jsonPretty = JSON.stringify(JSON.parse(json), null, 4);
				var textArea = '<textarea id="tarea" rows="20" cols="80""/>' + jsonPretty + '</textarea><br/>'
				var itemDetails = '<br/><br/>Item : ' + ItemName + '<br/>Price: ' + Price + '<br/>';
				text += itemDetails;
				text += textArea;
				if (k != (obj[i].Categories[0].SubCategories[j].Items.length - 1)) {
					text += "<br/><br/>";
				} else {
					text += "<br/><br/><br/>"
				}
				itemCount++;
				order_id++;
			}
		}
	}

	document.getElementById("details").innerHTML = '<b>' + itemCount + '<b> single item ~ payloads created!<br/><br/>' + text;
	if (order_id == itemCount + 123456) {
		alert('Order Id has been set to default value!');
	}
}

function getDateTime() {
	var d = new Date(),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = '' + d.getFullYear(),
		sec = '' + d.getSeconds(),
		min = '' + d.getMinutes(),
		hour = '' + d.getHours();

	if (month.length < 2) {
		month = '0' + month;
	}
	if (day.length < 2) {
		day = '0' + day;
	}
	if (sec.length < 2) {
		sec = '0' + sec;
	}
	if (min.length < 2) {
		min = '0' + min;
	}
	if (hour.length < 2) {
		hour = '0' + hour;
	}
	return [year, month, day].join('-') + " " + [hour, min, sec].join(':');
}