import {
  createTunnel,
  SshOptions,
  TunnelOptions,
  ServerOptions,
  ForwardOptions,
} from "tunnel-ssh";

class Tunnel {
  private tunnelServer: unknown;
  private tunnelClient: unknown;
  private tunnelOptions: TunnelOptions = {
    autoClose: false,
    reconnectOnError: false
  };
  private forwardOptions: ForwardOptions = {
    dstPort: 0,
  };

  private serverConfig: ServerOptions = {};

  constructor(private config: SshOptions) { }

  public async _init(): Promise<void> {
    const [server, client] = await createTunnel(
      this.tunnelOptions,
      this.serverConfig,
      this.config,
      this.forwardOptions
    );
    server.on("connection", (socket) => {
      console.log("connection", socket);
    });
    this.tunnelServer = server;
    this.tunnelClient = client;
  };
}

export default Tunnel;
