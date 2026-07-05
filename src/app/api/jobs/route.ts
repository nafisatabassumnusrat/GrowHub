import { NextResponse } from 'next/server';

// Preset neighborhoods/countries mapping
function inferCountry(location: string): string {
  const loc = location.toLowerCase();
  if (loc.includes('united states') || loc.includes('usa') || loc.includes('new york') || loc.includes('san francisco')) return 'USA';
  if (loc.includes('united kingdom') || loc.includes('uk') || loc.includes('london')) return 'UK';
  if (loc.includes('canada') || loc.includes('toronto') || loc.includes('vancouver')) return 'Canada';
  if (loc.includes('germany') || loc.includes('berlin') || loc.includes('munich') || loc.includes('hamburg') || loc.includes('cologne') || loc.includes('frankfurt')) return 'Germany';
  if (loc.includes('united arab emirates') || loc.includes('uae') || loc.includes('dubai') || loc.includes('abu dhabi')) return 'UAE';
  if (loc.includes('remote') || loc.includes('anywhere')) return 'USA';
  
  // Hash country assignment to distribute fallback data evenly
  const countries = ['USA', 'UK', 'Canada', 'Germany', 'UAE'];
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return countries[hash % countries.length];
}

// Generate salary range if not present
function generateSalary(title: string): string {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const min = 40 + (hash % 60); // 40k to 100k
  const max = min + 20 + (hash % 40); // min + 20k to min + 60k
  
  if (title.toLowerCase().includes('senior') || title.toLowerCase().includes('lead') || title.toLowerCase().includes('chief')) {
    return `$${(min * 1.5).toFixed(0)}k - $${(max * 1.5).toFixed(0)}k/year`;
  }
  return `$${min}k - $${max}k/year`;
}

// Mock Local Bangladesh On-site Jobs
const LOCAL_BD_JOBS = [
  {
    title: 'Senior React Developer',
    company: 'Brain Station 23',
    location: 'Dhaka',
    city: 'Dhaka',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳80,000 - ৳1,20,000/month',
    url: 'https://bd.linkedin.com/jobs/view/senior-react-developer-at-brain-station-23',
  },
  {
    title: 'Software Engineer (Laravel)',
    company: 'Kaz Software',
    location: 'Dhaka',
    city: 'Dhaka',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳60,000 - ৳90,000/month',
    url: 'https://kaz.com.bd/careers',
  },
  {
    title: 'UI/UX Designer',
    company: 'Selise Digital',
    location: 'Dhaka',
    city: 'Dhaka',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳50,000 - ৳75,000/month',
    url: 'https://selise.ch/careers',
  },
  {
    title: 'Junior QA Engineer',
    company: 'Therap Services BD',
    location: 'Dhaka',
    city: 'Dhaka',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳35,000 - ৳45,000/month',
    url: 'https://www.therapservices.net/careers',
  },
  {
    title: 'Full Stack Web Developer',
    company: 'Chittagong Software Solutions',
    location: 'Chittagong',
    city: 'Chittagong',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳45,000 - ৳65,000/month',
    url: 'https://chittagongsoftware.com/careers',
  },
  {
    title: 'Mobile App Developer (Flutter)',
    company: 'PortCity Tech',
    location: 'Chittagong',
    city: 'Chittagong',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳50,000 - ৳80,000/month',
    url: 'https://portcitytech.com/jobs',
  },
  {
    title: 'Web Content Creator',
    company: 'Sylhet Digital Hub',
    location: 'Sylhet',
    city: 'Sylhet',
    mode: 'offline',
    type: 'Contract',
    salary: '৳25,000 - ৳35,000/month',
    url: 'https://sylhetdigital.com',
  },
  {
    title: 'Network & System Administrator',
    company: 'Tea Garden Tech',
    location: 'Sylhet',
    city: 'Sylhet',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳40,000 - ৳55,000/month',
    url: 'https://teagardentech.net',
  },
  {
    title: 'Database Developer',
    company: 'Varendra IT Solutions',
    location: 'Rajshahi',
    city: 'Rajshahi',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳40,000 - ৳60,000/month',
    url: 'https://varendrait.com',
  },
  {
    title: 'Front-End React Intern',
    company: 'SilkCity Code Studio',
    location: 'Rajshahi',
    city: 'Rajshahi',
    mode: 'offline',
    type: 'Freelance',
    salary: '৳15,000 - ৳22,000/month',
    url: 'https://silkcitycode.com',
  },
  {
    title: 'SEO Specialist',
    company: 'Khulna Tech Park',
    location: 'Khulna',
    city: 'Khulna',
    mode: 'offline',
    type: 'Full-time',
    salary: '৳30,000 - ৳45,000/month',
    url: 'https://khulnatechpark.com',
  },
  {
    title: 'Python Django Developer',
    company: 'Sundarban Web Agency',
    location: 'Khulna',
    city: 'Khulna',
    mode: 'offline',
    type: 'Contract',
    salary: '৳55,000 - ৳75,000/month',
    url: 'https://sundarbanweb.com',
  }
];

// Mock Hybrid Jobs (mixed local and global)
const MOCK_HYBRID_JOBS = [
  {
    title: 'Hybrid Front-End Developer',
    company: 'TigerIT Bangladesh',
    location: 'Dhaka (Hybrid)',
    city: 'Dhaka',
    country: 'Bangladesh',
    mode: 'hybrid',
    hybridType: 'mostly_office',
    type: 'Full-time',
    salary: '৳70,000 - ৳1,00,000/month',
    url: 'https://tigerit.com/careers',
  },
  {
    title: 'Hybrid DevOps Engineer',
    company: 'Chalo Technologies',
    location: 'Dhaka (Hybrid)',
    city: 'Dhaka',
    country: 'Bangladesh',
    mode: 'hybrid',
    hybridType: 'mostly_remote',
    type: 'Full-time',
    salary: '৳90,000 - ৳1,30,000/month',
    url: 'https://chalo.tech/careers',
  },
  {
    title: 'Hybrid Content Manager',
    company: 'Codemen BD',
    location: 'Dhaka (Hybrid)',
    city: 'Dhaka',
    country: 'Bangladesh',
    mode: 'hybrid',
    hybridType: 'flexible',
    type: 'Full-time',
    salary: '৳40,000 - ৳55,000/month',
    url: 'https://codemen.com',
  },
  {
    title: 'Hybrid Project Coordinator',
    company: 'Creative Tech Chittagong',
    location: 'Chittagong (Hybrid)',
    city: 'Chittagong',
    country: 'Bangladesh',
    mode: 'hybrid',
    hybridType: 'mostly_office',
    type: 'Full-time',
    salary: '৳35,000 - ৳50,000/month',
    url: 'https://creativetech.com.bd',
  },
  {
    title: 'Hybrid Full-Stack Developer (MERN)',
    company: 'Silicon Beach Technologies',
    location: 'New York (Hybrid)',
    city: 'New York',
    country: 'USA',
    mode: 'hybrid',
    hybridType: 'mostly_remote',
    type: 'Contract',
    salary: '$4,000 - $6,000/month',
    url: 'https://siliconbeach.co/careers',
  },
  {
    title: 'Hybrid Technical Recruiter',
    company: 'TalentHub London',
    location: 'London (Hybrid)',
    city: 'London',
    country: 'UK',
    mode: 'hybrid',
    hybridType: 'flexible',
    type: 'Full-time',
    salary: '£3,000 - £4,500/month',
    url: 'https://talenthub.co.uk',
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'remote'; // remote, offline, hybrid
  const country = searchParams.get('country') || '';
  const city = searchParams.get('city') || '';
  const hybridType = searchParams.get('hybridType') || ''; // mostly_remote, mostly_office, flexible
  const query = searchParams.get('q') || '';

  let jobsList: any[] = [];

  if (mode === 'remote') {
    // 1. Remote Job Mode - Fetch real-time jobs from Arbeitnow
    try {
      const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Filter and map Arbeitnow jobs
        jobsList = (data.data || [])
          .filter((j: any) => j.remote === true) // filter remote
          .map((j: any) => {
            const mappedCountry = inferCountry(j.location);
            return {
              id: `remote-${j.slug}`,
              title: j.title,
              company: j.company_name,
              location: `Remote (${j.location})`,
              country: mappedCountry,
              mode: 'remote',
              type: j.job_types && j.job_types.length > 0 ? j.job_types[0] : 'Full-time',
              salary: generateSalary(j.title),
              url: j.url,
              dateAdded: new Date(j.created_at * 1000).toISOString(),
              popularity: Math.floor(Math.random() * 500) + 50,
            };
          });
      }
    } catch (error) {
      console.error('Failed to crawl/fetch live Arbeitnow remote jobs:', error);
    }
    
    // Apply country sub-filter if selected
    if (country) {
      jobsList = jobsList.filter(j => j.country.toLowerCase() === country.toLowerCase());
    }

  } else if (mode === 'offline') {
    // 2. Offline Job Mode - Local BD Jobs with dynamic crawling simulator
    jobsList = LOCAL_BD_JOBS.map((j, index) => {
      // Create dynamically fresh timestamps to simulate live scraper updates
      const date = new Date();
      date.setMinutes(date.getMinutes() - (index * 45 + 15)); // offset back in time
      
      return {
        id: `offline-bd-${index}`,
        ...j,
        country: 'Bangladesh',
        dateAdded: date.toISOString(),
        popularity: Math.floor(Math.random() * 300) + 20,
      };
    });

    // Apply city sub-filter if selected
    if (city) {
      jobsList = jobsList.filter(j => j.city.toLowerCase() === city.toLowerCase());
    }

  } else if (mode === 'hybrid') {
    // 3. Hybrid Job Mode - Mix of Remote + BD Hybrid jobs
    jobsList = MOCK_HYBRID_JOBS.map((j, index) => {
      const date = new Date();
      date.setHours(date.getHours() - index);
      
      return {
        id: `hybrid-${index}`,
        ...j,
        dateAdded: date.toISOString(),
        popularity: Math.floor(Math.random() * 400) + 30,
      };
    });

    // Apply hybrid sub-filters ("mostly_remote", "mostly_office", "flexible")
    if (hybridType) {
      jobsList = jobsList.filter(j => j.hybridType === hybridType);
    }
  }

  // 4. Global Text Search Filtering
  if (query) {
    const q = query.toLowerCase();
    jobsList = jobsList.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  }

  // 5. Deduplicate job listings (Title + Company name unique hashing)
  const seenJobs = new Set<string>();
  const deduplicatedJobs = jobsList.filter(j => {
    const hashKey = `${j.title.toLowerCase()}_${j.company.toLowerCase()}`;
    if (seenJobs.has(hashKey)) return false;
    seenJobs.add(hashKey);
    return true;
  });

  return NextResponse.json({
    jobs: deduplicatedJobs,
    timestamp: new Date().toISOString()
  });
}
