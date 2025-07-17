import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { authorizationData } from "../../data/authorizationData";

function Authorization() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={authorizationData.securityMechanismTitle}
      definition={authorizationData.definition}
      interestingFacts={authorizationData.interestingFacts}
      implementationDescription={authorizationData.implementationDescription}
      implementationCode={authorizationData.implementationCode}
      goodPractices={authorizationData.goodPractices}
      threats={authorizationData.threats}
    />
  );
}

export default Authorization;
