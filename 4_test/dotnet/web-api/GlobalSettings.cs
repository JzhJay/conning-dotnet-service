namespace Conning.Kui.Web
{
    public class GlobalSettings
    {
        public ClientGlobals clientGlobals { get; set; }
        public AdviseAppSettings settings { get; set; }
        public bool debugBuild { get; set; }
    }

    public class ClientGlobals
    {
        public string authProvider { get; set; }
        public string authClientId { get; set; }
        public string authDomain { get; set; }
        public string sentryDsn { get; set; }
        public string sentryServerDsn { get; set; }
        public string product { get; set; }
        public ClientFeatureSettings features { get; set; }
        public bool multiTenant { get; set; }
        public string customerName { get; set; }
        public long licenseExpireTime { get; set; }
        public bool isOnPrem { get; set; }
    }
}
