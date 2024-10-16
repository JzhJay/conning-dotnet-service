using Amazon;

namespace Conning {
	/* For auto-serialization to work, these must be classes (not interfaces) */

	public class GraphQLSettings_Schemas
	{
		public string omdb { get; set; }
	}

	public class GraphQLSettings
	{
		public GraphQLSettings_Schemas schemas { get; set; }
	}

	public class ClientFeatureSettings
	{
		public bool classic { get; set; }
		public bool billing { get; set; }
	}

	public class AdviseAppSettings
	{
		public ClientFeatureSettings clientFeatures { get; set; }
		public bool cdn { get; set; }
		public string pathToPreferences { get; set; }
		public GridSettings Grid { get; set; }
		public TestSettings Test { get; set; }

		public AuthSettings auth { get; set; }
		public MongoSettings mongo { get; set; }
		public PostgreSettings postgres { get; set; }
		public AwsSettings aws { get; set; }
		public JuliaSettings julia { get; set; }
		public EmailSettings email { get; set; }
		public SentryIoSettings sentryIo { get; set; }
		public GraphQLSettings graphQL { get; set; }
		public OmdbSettings omdb { get; set; }
		public OpsGenieSettings opsgenie { get; set; }
		public SplunkSettings splunk { get; set; }
		public bool karma { get; set; }
		public int webServerPort { get; set; }
		public string product { get; set; }
		public bool multiTenant { get; set; }

		public bool isTestingEnvironment { get; set; }

		public ContentSecurityPolicy csp { get; set; }
	}

	public class OmdbSettings
	{
		public OmdbCacheSettings cache { get; set; }
		public bool watchCollections { get; set; }
		public string schemaVersion { get; set; }
		public class OmdbCacheSettings
		{
			public int distinctValues { get; set; }
			public int runQuery { get; set; }
		}
	}

	public class OpsGenieSettings
	{
		public string key { get; set; }
	}

	public class SplunkSettings
	{
		public string key { get; set; }
	}

	public class License
	{
		public string product { get; set; }
		public string customer { get; set; }
		public long startMilliseconds { get; set; }
		public long expMilliseconds { get; set; } // licenseExpireTime
		public string start { get; set; }
		public string exp { get; set; }
	}

	public class AuthSettings
	{
		public string provider { get; set; }
		public string clientId { get; set; }
		public string clientSecret { get; set; }

		public string restClientId { get; set; }
		public string restSecret { get; set; }

		public string domain { get; set; }
		public string issuerDomain { get; set; }

		public string api { get; set; }

		public string tenant { get; set; }

		public bool isSyncUserData { get; set; }

		public int syncIntervalMilliseconds { get; set; }

		public bool ignoreSslCertCheck { get; set; }

		public License license { get; set; }
	}

	public class AwsSettings
	{
		public string gridLogQueueUrl { get; set; }
		public string notificationQueueUrl { get; set; }
		public string sesSourceArn { get; set; }
		public string bouncedEmailQueueUrl { get; set; }
		public string bouncedEmailConfigurationSet { get; set; }
		public string scriptBucketName { get; set; }
		public string mongoCredentialsJsonFile { get; set; }
		public RegionEndpoint region { get; set; }
		public string cspLogGroupName { get; set; }
	}

	public class JuliaSettings
	{
		public string hostname { get; set; }
		public string sharedSecret { get; set; }
	}

	public class EmailSettings
	{
		public string support { get; set; }
		public string notification { get; set; }
		public RegionEndpoint region { get; set; }
	}

	public class MongoSettings
	{
		public string connection { get; set; }
		public string connectionString { get; set; }

		public bool? autoIdleTenant { get; set; }

		public int? idleTimeoutMS { get; set; }

		public MongoCredentials credentials { get; set; }

		public class MongoCredentials
		{
			public string username { get; set; }
			public string password { get; set; }
		}
	}

	public class PostgreSettings
	{
		public string connection { get; set; }
		public string connectionString { get; set; }
		public bool? autoIdleTenant { get; set; }
		public int? idleTimeoutMS { get; set; }
	}

    public class GridSettings {
        public string[] managers { get; set; }
    }

    public class TestSettings {
        public string kTempFileOutDirectory { get; set; }
        public string gridTempFolder { get; set; }
        public string testScriptsRoot { get; set;}
    }

	public class SentryIoSettings
	{
		public string dsn { get; set; }
		public string serverDsn { get; set; }
	}

	public class CspReportEndpoints
	{
		public string url { get; set; }
	}

	public class CspReportSetting
	{
		public string group { get; set; }
		public int max_age { get; set; }
		public bool include_subdomains { get; set; }
		public CspReportEndpoints[] endpoints { get; set; }
	}

	public class ContentSecurityPolicy
	{
		public CspReportSetting reportTo { get; set; }
		public string[] connectSrc { get; set; }

		public string[] frameSrc { get; set; }
		public string[] scriptSrc { get; set; }

		public string[] styleSrc { get; set; }

		public string[] imgSrc { get; set; }

		public string[] fontSrc { get; set; }

		public string[] prefetchSrc { get; set; }
	}

}
