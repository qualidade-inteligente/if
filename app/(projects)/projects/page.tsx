import { AllProjects } from "@/components/project/all-projects";
import { getProjects } from "@/actions/projects";

export default async function ProjectsListPage() {
  const projects = await getProjects();
  if (!projects) {
    return <div>No projects found</div>;
  }
  return <AllProjects projects={projects} />;
}
