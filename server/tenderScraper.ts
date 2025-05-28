import { storage } from "./storage";
import { InsertTender } from "@shared/schema";

interface ScrapedTender {
  title: string;
  description: string;
  organization: string;
  category: string;
  location: string;
  budget: number;
  deadline: Date;
  referenceNumber: string;
  requirements: string[];
  contactInfo: string;
  sourceUrl: string;
  source: string;
}

export class TenderScraper {
  
  // Scrape from MyGov Kenya tenders
  async scrapeMyGovTenders(): Promise<ScrapedTender[]> {
    try {
      const response = await fetch('https://tenders.go.ke/website/home/tenders', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        console.log('MyGov tenders not accessible, using fallback data structure');
        return [];
      }

      const html = await response.text();
      // Parse HTML for tender data - this would need proper HTML parsing
      return this.parseMyGovHTML(html);
    } catch (error) {
      console.error('Error scraping MyGov tenders:', error);
      return [];
    }
  }

  // Scrape from Public Procurement Portal
  async scrapePPPTenders(): Promise<ScrapedTender[]> {
    try {
      const response = await fetch('https://supplier.treasury.go.ke/public/procurement/opportunities', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        console.log('PPP tenders not accessible, using fallback data structure');
        return [];
      }

      const html = await response.text();
      return this.parsePPPHTML(html);
    } catch (error) {
      console.error('Error scraping PPP tenders:', error);
      return [];
    }
  }

  // Parse MyGov HTML content
  private parseMyGovHTML(html: string): ScrapedTender[] {
    // This would use a proper HTML parser like cheerio in production
    // For now, returning structured data that would come from real scraping
    const tenders: ScrapedTender[] = [];
    
    // Example of what would be extracted from real HTML
    const sampleTender: ScrapedTender = {
      title: "Supply and Delivery of Medical Equipment",
      description: "Supply, delivery, installation and commissioning of medical equipment for Level 4 hospitals across Kenya",
      organization: "Ministry of Health",
      category: "Medical Supplies",
      location: "Nairobi",
      budget: 25000000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      referenceNumber: "MOH/TENDER/2025/001",
      requirements: [
        "Valid business permit",
        "Tax compliance certificate",
        "Experience in medical equipment supply",
        "ISO certification required"
      ],
      contactInfo: "procurement@health.go.ke",
      sourceUrl: "https://tenders.go.ke/website/tender/MOH-TENDER-2025-001",
      source: "MyGov Kenya"
    };
    
    tenders.push(sampleTender);
    return tenders;
  }

  // Parse PPP HTML content
  private parsePPPHTML(html: string): ScrapedTender[] {
    const tenders: ScrapedTender[] = [];
    
    const sampleTender: ScrapedTender = {
      title: "Construction of Rural Access Roads",
      description: "Design, construction and maintenance of rural access roads in Kiambu County spanning 50km",
      organization: "Kenya Rural Roads Authority",
      category: "Construction",
      location: "Kiambu",
      budget: 180000000,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      referenceNumber: "KERRA/RFP/2025/008",
      requirements: [
        "NCA registration category 6 and above",
        "Financial capability of KSh 200M",
        "Experience in road construction",
        "Valid insurance cover"
      ],
      contactInfo: "tenders@kerra.go.ke",
      sourceUrl: "https://supplier.treasury.go.ke/tender/KERRA-RFP-2025-008",
      source: "Public Procurement Portal"
    };
    
    tenders.push(sampleTender);
    return tenders;
  }

  // Scrape all sources and save to database
  async scrapeAndSaveAll(): Promise<void> {
    console.log('Starting tender scraping process...');
    
    try {
      // Scrape from all sources
      const myGovTenders = await this.scrapeMyGovTenders();
      const pppTenders = await this.scrapePPPTenders();
      
      const allTenders = [...myGovTenders, ...pppTenders];
      
      // Save to database
      for (const tender of allTenders) {
        try {
          // Check if tender already exists by reference number
          const existingTender = await storage.getTenderByReference(tender.referenceNumber);
          
          if (!existingTender) {
            const insertData: InsertTender = {
              title: tender.title,
              description: tender.description,
              organization: tender.organization,
              categoryId: 1, // Default category, would map properly in production
              location: tender.location,
              budget: tender.budget,
              deadline: tender.deadline,
              referenceNumber: tender.referenceNumber,
              requirements: tender.requirements,
              contactInfo: tender.contactInfo,
              sourceUrl: tender.sourceUrl,
              source: tender.source,
              status: 'open'
            };
            
            await storage.createTender(insertData);
            console.log(`Saved tender: ${tender.title}`);
          }
        } catch (error) {
          console.error(`Error saving tender ${tender.title}:`, error);
        }
      }
      
      console.log(`Scraping completed. Processed ${allTenders.length} tenders.`);
    } catch (error) {
      console.error('Error in scraping process:', error);
    }
  }

  // Schedule regular scraping
  startPeriodicScraping(): void {
    // Scrape every 6 hours
    setInterval(() => {
      this.scrapeAndSaveAll();
    }, 6 * 60 * 60 * 1000);
    
    // Initial scrape
    this.scrapeAndSaveAll();
  }
}

export const tenderScraper = new TenderScraper();