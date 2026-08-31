const expectedSource = {
  repository: "weitzu-com/lunyu.ai",
  productionBranch: "main",
  productionHost: "www.lunyu.ai",
} as const;

function value(name: string) {
  return process.env[name]?.trim() || null;
}

export function GET() {
  return Response.json(
    {
      schemaVersion: 1,
      expectedSource,
      deployment: {
        provider: process.env.VERCEL === "1" ? "vercel" : "local",
        environment: value("VERCEL_ENV"),
        id: value("VERCEL_DEPLOYMENT_ID"),
        url: value("VERCEL_URL"),
        projectProductionUrl: value("VERCEL_PROJECT_PRODUCTION_URL"),
      },
      git: {
        provider: value("VERCEL_GIT_PROVIDER"),
        repositoryOwner: value("VERCEL_GIT_REPO_OWNER"),
        repositorySlug: value("VERCEL_GIT_REPO_SLUG"),
        commitRef: value("VERCEL_GIT_COMMIT_REF"),
        commitSha: value("VERCEL_GIT_COMMIT_SHA"),
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "X-Robots-Tag": "noindex",
      },
    }
  );
}
