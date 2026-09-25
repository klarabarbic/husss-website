/* ============================================================================
   BOARD MEMBERS

   Clicking a card opens that person's bio, email and LinkedIn.

   photo     ->  the headshot, saved in public/board/. Write the path starting
                 with "/board/", e.g. "/board/klara.png".
   pos       ->  how the headshot is cropped inside the 4:5 frame ("left% top%").
                 Lower the second number to show more forehead, raise it to show
                 more chin.
   linkedin  ->  "" hides the LinkedIn button for that person. Paste the full
                 profile URL to switch it on.
   bio       ->  one string per paragraph.
   ========================================================================= */

export type BoardMember = {
  name: string;
  role: string;
  photo: string;
  pos: string;
  email: string;
  linkedin: string;
  bio: string[];
};

export const BOARD: BoardMember[] = [
  {
    name: "Klara Barbić",
    role: "Co-President",
    photo: "/board/klara.png",
    pos: "50% 50%",
    email: "klarabarbic@college.harvard.edu",
    linkedin: "https://www.linkedin.com/in/klara-barbic-11522a283/",
    bio: [
      "Klara is a senior studying Statistics on the concurrent AB/AM track, with a secondary field in Theater, Dance & Media, and an aspiring researcher at the intersection of AI and law. She has been a course assistant for Probability, Statistical Inference, and Sampling and Estimation, and as a research assistant she helped a professor build the Sampling and Estimation course materials she now teaches from.",
      "Outside of coursework and HUSSS she dances, with Latin American and Afro-Caribbean styles her favorites, and she sings with the Radcliffe Choral Society. She was a varsity track and field athlete until the fall of 2026, when an injury brought that career to a close.",
    ],
  },
  {
    name: "Đorđe Ivanović",
    role: "Co-President",
    photo: "/board/djordje.png",
    pos: "48% 50%",
    email: "dorde_ivanovic@college.harvard.edu",
    linkedin: "https://www.linkedin.com/in/djordjeiv/",
    bio: [
      "Đorđe is a senior from Montenegro studying Computer Science. He serves as AI Strategy Consultant to the Prime Minister of Montenegro, where he built the country's national AI data layer, spanning more than 1.5 million government records, along with the first Montenegrin-speaking voice AI agent.",
      "He has been a Bain Capital Ventures Labs Fellow and a software engineer at Zenlytic, and he built Talas, an AI people-intelligence platform for the Balkans and its diaspora. On campus he is software lead and treasurer of the Harvard Undergraduate Robotics Club, and he runs HUSSS as co-president alongside Klara.",
    ],
  },
  {
    name: "Sabrina Bukvarević",
    role: "Treasurer",
    photo: "/board/sabrina.jpg",
    pos: "50% 45%",
    email: "sbukvarevic@college.harvard.edu",
    linkedin: "https://www.linkedin.com/in/sabrina-bukvarevic/",
    bio: [
      "Sabrina studies Economics and Government. She is a Bosnian American who grew up in Des Plaines, Illinois, and she speaks remarkable Bosnian.",
      "Outside of HUSSS she is involved with the Harvard Undergraduate Marketing Group. As treasurer she looks after the society's budget and the HUA funding behind every event we run, and she makes extraordinary burek, as anyone who came to the Harvard × MIT South Slavic Social will happily confirm.",
    ],
  },
  {
    name: "Benjamin Mujkić",
    role: "Board Member",
    photo: "/board/benjamin.jpg",
    pos: "49% 50%",
    email: "benjaminmujkic@college.harvard.edu",
    linkedin: "https://www.linkedin.com/in/benjamin-mujki%C4%87-930839338/",
    bio: [
      "Benjamin is a sophomore from Novi Travnik, Bosnia and Herzegovina, planning to study Computer Science and Statistics. He won his country's first ever gold medal at the International Mathematical Olympiad, and he represents Harvard at the International Collegiate Programming Contest, where his team placed fourth at the North America Northeast Regional.",
      "He is a course assistant for theoretical linear algebra and real analysis, and he taught his own game theory seminar to high school students in Shanghai. His quantitative interests run through the Harvard Undergraduate Data Analytics Group and Harvard Undergraduate Quantitative Traders, alongside the early-talent programs run by the major quant firms.",
    ],
  },
  {
    name: "Tian Vlašić",
    role: "Board Member",
    photo: "/board/tian.jpg",
    pos: "50% 26%",
    email: "tianvlasic@college.harvard.edu",
    linkedin: "https://www.linkedin.com/in/tianvlasic/",
    bio: [
      "Tian is a sophomore pursuing a double A.B. in Mathematics and Psychology, and an international student from a small island in Croatia. He was recognized early as a major talent there, which is what took him to Zagreb for high school.",
      "He has an extensive background in pure mathematics, with commended results in the Croatian National Mathematics Competitions and work alongside university mathematics faculty. He was one of two recipients of the Harvard Prize Book Award in Croatia in 2024, won the ACAP Future Leaders Scholarship in 2025, and is a published author. His academic interests are metric geometry, axiomatic convexity and category theory.",
    ],
  },
];
