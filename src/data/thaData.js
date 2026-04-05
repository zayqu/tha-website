// Real THA data - Final Version
export const thaData = {
  registrationNo: "00NGO/R/8379",
  mission: "To strengthen public health systems through advocacy, research, partnerships, and capacity building, ensuring sustainable and resilient healthcare solutions.",
  vision: "To build a healthier Tanzania where everyone has equitable access to quality healthcare services.",
  motto: "Together for a Healthier Tanzania",
  heroDescription: "We work to combat the challenges of Viral Hepatitis, HIV, and Mental Health through advocacy, awareness, and access to care across Tanzania.",
  foundedYear: 2025,
  founder: {
    name: "Shaibu Issa",
    title: "Founder & Executive Director",
    story: "The organization was inspired by the personal experience of its founder, Shaibu Issa, who lost his brother to liver cancer in 2021 — a preventable condition with early detection and vaccination. This experience led to the creation of THA to increase awareness, promote prevention, improve access to healthcare, and address stigma related to diseases such as hepatitis."
  },
  team: [
    { name: "Shaibu Issa", title: "Founder and Executive Director" },
    { name: "Shuwena H. Ali", title: "Associate Director and Administrative Manager" },
    { name: "Enock Sichone", title: "General Secretary" },
    { name: "Juma Issa", title: "Treasurer" },
    { name: "Mohammed Nandute", title: "Head of Marketing and Publicity" },
    { name: "Edward Masele", title: "Project Coordinator" }
  ],
  coreValues: [
    "Compassion", "Integrity", "Equity", "Collaboration", "Innovation", "Empowerment", "Excellence"
  ],
  objectives: [
    "Promote equitable access to affordable and quality healthcare",
    "Strengthen healthcare systems through training and support",
    "Conduct and share public health research",
    "Build partnerships with stakeholders (government, NGOs, donors, communities)",
    "Support community-based health education and interventions"
  ],
  impact: [
    "Delivered awareness programs in rural and urban areas",
    "Advocated for improved health policies",
    "Trained healthcare providers and community workers",
    "Strengthened community health systems"
  ],
  thematicAreas: [
    {
      name: "Viral Hepatitis",
      challenges: ["Low awareness", "Undiagnosed cases", "Limited access to treatment"],
      approach: ["Public education campaigns", "Vaccination promotion (especially Hepatitis B)", "Collaboration with healthcare providers for early detection"]
    },
    {
      name: "HIV",
      challenges: ["Stigma", "Limited education", "Barriers to accessing care"],
      approach: ["Awareness and stigma reduction campaigns", "Promoting testing and treatment access", "Policy advocacy for improved healthcare services"]
    },
    {
      name: "Mental Health",
      challenges: ["Social stigma", "Limited resources", "Increasing demand for services"],
      approach: ["Community awareness programs", "Advocacy for funding and services", "Establishment of support and counseling initiatives"]
    }
  ],
  programs: [
    {
      name: "KAPIME Campaign",
      description: "A flagship initiative focused on Hepatitis B awareness, testing, and vaccination. Includes community outreach, training health ambassadors, and partnerships to eliminate hepatitis by 2030.",
      focus: "Hepatitis"
    },
    {
      name: "Life Unlocked",
      description: "A youth-focused program addressing mental health and life transitions. Provides life skills, resilience training, and peer support.",
      focus: "Mental Health"
    },
    {
      name: "Talk To Heal",
      description: "Creates safe environments for mental health discussions through counseling, peer support, and community dialogue sessions.",
      focus: "Mental Health"
    }
  ],
  contact: {
    address: "Adda Estate, House No. 03, Kinondoni",
    poBox: "P.O. Box 31902",
    city: "Dar es Salaam",
    country: "Tanzania",
    emails: ["info@tzhealthalliance.or.tz"],
    phone: "+255 659 114 754",
    mobile: "+255 659 114 754"
  },
  social: {
    instagram: "https://instagram.com/tanzania_healthalliance",
    linkedin: "https://www.linkedin.com/company/tanzania-health-alliance",
    facebook: "https://www.facebook.com/tanzaniahealthalliance"
  },
  bankDetails: {
    bankName: "CRDB Bank",
    accountName: "Tanzania Health Alliance",
    accountNumber: "0123456789012",
    swiftCode: "CORUTZTZ"
  }
};

export const sendEmail = async (formData) => {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: "YOUR_WEB3FORMS_KEY",
      from_name: "THA Website",
      to_email: "info@tzhealthalliance.or.tz",
      subject: formData.subject || "New Contact Form Submission",
      ...formData,
    }),
  });
  return response.json();
};
