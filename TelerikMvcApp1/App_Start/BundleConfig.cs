using System.Web.Optimization;

namespace TelerikMvcApp1 {
	public class BundleConfig {
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles) {
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-{version}.js"));

			// Use the development version of Modernizr to develop with and learn from. Then, when you're
			// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
					  "~/Scripts/bootstrap.js",
					  "~/Scripts/respond.js"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
					  "~/Content/bootstrap.css",
					  "~/Content/site.css"));

			bundles.Add(new ScriptBundle("~/bundles/app").Include(
						"~/Scripts/App/CBmessagebox.js"
						));

			//Kendo Reports
			bundles.Add(new ScriptBundle("~/bundles/kendoReport").Include("~/ReportViewer/js/telerikReportViewer-9.0.15.324.js"));
			bundles.Add(new StyleBundle("~/Content/kendoReport/css").Include(
				"~/Content/font-awesome.min.css",
				"~/ReportViewer/styles/telerikReportViewer-9.0.15.324.css"));


			// Set EnableOptimizations to false for debugging. For more information,
			// visit http://go.microsoft.com/fwlink/?LinkId=301862
			#if DEBUG
				BundleTable.EnableOptimizations = false;			//Set to TRUE to turn on js minification
			#else
				BundleTable.EnableOptimizations = true;			//Set to TRUE to turn on js minification
			#endif
		}
	}
}
