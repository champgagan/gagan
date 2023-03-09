const http=require('http');

const server=http.createServer(function(req,res){
res.write("Will be online soon");
res.end();	
});

server.listen(3000,()=>{
console.log("server started on port 3000");
});






