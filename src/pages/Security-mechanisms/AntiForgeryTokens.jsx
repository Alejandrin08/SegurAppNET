import SecurityMechanismTemplate from "../../components/SecurityMechanismTemplate/SecurityMechanismTemplate";
import { antiForgeryTokensData } from "../../data/securityMechanisms";

function AntiForgeryTokens() {
  return (
    <SecurityMechanismTemplate
      securityMechanismTitle={antiForgeryTokensData.securityMechanismTitle}
      definition={antiForgeryTokensData.definition}
      interestingFacts={antiForgeryTokensData.interestingFacts}
      implementationDescription={antiForgeryTokensData.implementationDescription}
      implementationCode={antiForgeryTokensData.implementationCode}
      goodPractices={antiForgeryTokensData.goodPractices}
      threats={antiForgeryTokensData.threats}
    />
  );
}

export default AntiForgeryTokens;
