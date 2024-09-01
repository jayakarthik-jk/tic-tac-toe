use std::borrow::Cow;

use axum::Router;
use serde_json::Value;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

struct SocketHelper;
impl SocketHelper {
    fn get_user_room(&self, socket: &SocketRef) -> Option<Cow<'_, str>> {
        socket.rooms().ok()?.pop()
    }
}

async fn on_connect(socket: SocketRef) {
    socket.on(
        "connect-to-game",
        |socket: SocketRef, Data::<String>(id), io: SocketIo| {
            let sockets = io.to(id.clone()).sockets().unwrap();
            let users = sockets.len();
            if users > 1 {
                let _ = socket.emit("full", ());
                return;
            }
            let _ = socket.join(id.clone());

            if users == 0 {
                let _ = socket.emit("waiting", ());
            } else {
                let _ = socket.to(id.clone()).emit("connected", ());
                let _ = socket.emit("connected", ());
            }
        },
    );

    for event in ["icecandidate", "offer", "answer"] {
        socket.on(event, move |socket: SocketRef, Data::<Value>(data)| {
            let Some(room) = SocketHelper.get_user_room(&socket) else {
                return;
            };
            let _ = socket.to(room).emit(event, data);
        });
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // let frontend_root = ServeFile::new("static/index.html");
    // let static_assets = ServeDir::new("static/assets/");

    let (layer, io) = SocketIo::new_layer();
    io.ns("/", on_connect);

    let app = Router::new()
        .with_state(io)
        // .nest_service("/assets", static_assets)
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
                .layer(layer),
        );
    // .fallback_service(frontend_root);

    let listener = TcpListener::bind("127.0.0.1:3001").await.unwrap();

    axum::serve(listener, app).await.unwrap();

    Ok(())
}
