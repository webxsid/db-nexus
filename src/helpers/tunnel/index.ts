import {
  createTunnel,
  SshOptions,
  TunnelOptions,
  ServerOptions,
} from "tunnel-ssh";

class Tunnel {
  private tunnelServer: unknown;
  private tunnelClient: unknown;
  private tunnelOptions: TunnelOptions = {
    autoClose: false,
  };
  private serverConfig: ServerOptions | null = null;

  constructor(private config: SshOptions) {}

  public init = async () => {
    const [server, client] = await createTunnel(
      this.tunnelOptions,
      this.serverConfig,
      this.config
    );
    server.on("connection", (socket) => {
      console.log("connection", socket);
    });
    this.tunnelServer = server;
    this.tunnelClient = client;
  };
}

export default Tunnel;
