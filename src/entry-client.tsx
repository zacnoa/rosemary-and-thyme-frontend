// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

/**
 * Browser entry point: hydrates the server-rendered markup in place (see
 * entry-server.tsx for the `<div id="app">` this mounts into). Standard
 * SolidStart boilerplate - app-specific setup lives in app.tsx instead.
 */
mount(() => <StartClient />, document.getElementById("app")!);
