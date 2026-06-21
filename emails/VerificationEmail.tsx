import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "react-email";

interface VerificationEmailProps {
  username: string;
  verifyCode: string;
}

export default function VerificationEmail({
  username,
  verifyCode,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Verify your email address
      </Preview>

      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>
            Verify Your Email
          </Heading>

          <Text style={text}>
            Hello {username},
          </Text>

          <Text style={text}>
            Thanks for signing up for AnonymsG.
            Use the verification code below to verify your email.
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>
              {verifyCode}
            </Text>
          </Section>

          <Text style={smallText}>
            This code expires in a few minutes.
          </Text>

          <Text style={footer}>
            © AnonyMsg
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f5f5f5",
  padding: "40px 0",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  maxWidth: "500px",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
  border: "1px solid #e5e5e5",
};

const heading = {
  color: "#111827",
  fontSize: "28px",
  marginBottom: "24px",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
};

const codeContainer = {
  backgroundColor: "#f3f4f6",
  textAlign: "center" as const,
  padding: "20px",
  borderRadius: "8px",
  margin: "24px 0",
};

const code = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "6px",
  color: "#111827",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
};

const footer = {
  marginTop: "32px",
  textAlign: "center" as const,
  color: "#9ca3af",
  fontSize: "12px",
};