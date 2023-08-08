const awsloginGenerators: Record<"databases" | "roles", Fig.Generator> = {
  databases: {
    script: "awslogin",
    postProcess: (output: string) => {
      if (output.startsWith("fatal:")) {
        return [];
      }
      const databases = findListFromOutput(output, "Available databases:");
      return databases.map((database) => {
        return {
          name: database.trim(),
          description: "Database",
        };
      });
    },
  },
  roles: {
    script: "awslogin",
    postProcess: (output: string) => {
      if (output.startsWith("fatal:")) {
        return [];
      }
      const roles = findListFromOutput(output, "Available roles:");
      return roles.map((role) => {
        return { name: role.trim(), description: "Role" };
      });
    },
  },
};

const completionSpec: Fig.Spec = {
  name: "awslogin",
  description: "Built tool to login to AWS",
  args: { name: "role", generators: awsloginGenerators.roles },
  options: [
    {
      name: "--db-login",
      displayName: "--db-login=<database>",
      requiresSeparator: true,
      description: "Log into a MySQL prompt",
      icon: "💽",
      args: {
        name: "database",
        generators: awsloginGenerators.databases,
      },
    },
    {
      name: "--db",
      displayName: "--db=<database>",
      requiresSeparator: true,
      description: "Return a MySQL login command",
      icon: "💽",
      args: {
        name: "database",
        generators: awsloginGenerators.databases,
      },
    },
    {
      name: ["--help", "-h"],
      description: "Return a MySQL login command",
    },
  ],
};

export default completionSpec;

function findListFromOutput(output: string, startOfListIndicator: string) {
  const outputLines = output.split("\n");
  const startOfListIndex =
    outputLines.findIndex((line) => line.startsWith(startOfListIndicator)) + 1;
  const endOfListIndex = outputLines.indexOf("", startOfListIndex);
  return outputLines.slice(
    startOfListIndex,
    endOfListIndex === -1 ? undefined : endOfListIndex
  );
}
