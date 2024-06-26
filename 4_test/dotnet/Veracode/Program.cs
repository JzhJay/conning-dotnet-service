using CommandLine;

namespace Veracode.Rest.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Parser.Default.ParseArguments<DynamicAnalysisScan>(args)
                .WithParsed(scan => scan.Execute());
        }
    }
}