import { parseCSV } from '../csvConverter';

describe('csvConverter', () => {
  describe('parseCSV', () => {
    it('should parse simple CSV content', () => {
      const content = 'A,B,C\nD,E,F';
      const result = parseCSV(content);
      
      expect(result).toEqual([
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
      ]);
    });

    it('should handle single row', () => {
      const content = 'A,B,C';
      const result = parseCSV(content);
      
      expect(result).toEqual([['A', 'B', 'C']]);
    });

    it('should handle single cell', () => {
      const content = 'A';
      const result = parseCSV(content);
      
      expect(result).toEqual([['A']]);
    });

    it('should trim whitespace from cells', () => {
      const content = ' A , B , C \n D , E , F ';
      const result = parseCSV(content);
      
      expect(result).toEqual([
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
      ]);
    });

    it('should handle empty cells', () => {
      const content = 'A,,C\n,E,';
      const result = parseCSV(content);
      
      expect(result).toEqual([
        ['A', '', 'C'],
        ['', 'E', ''],
      ]);
    });

    it('should handle blocked cells marker', () => {
      const content = '#,A,#\nB,#,C';
      const result = parseCSV(content);
      
      expect(result).toEqual([
        ['#', 'A', '#'],
        ['B', '#', 'C'],
      ]);
    });

    it('should handle numbers', () => {
      const content = '1,2,3\n-1,0,5';
      const result = parseCSV(content);
      
      expect(result).toEqual([
        ['1', '2', '3'],
        ['-1', '0', '5'],
      ]);
    });

    it('should handle Windows line endings (CRLF)', () => {
      const content = 'A,B\r\nC,D';
      const result = parseCSV(content);
      
      // After trim, the \r should be handled
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(['A', 'B']);
    });

    it('should handle empty content', () => {
      const content = '';
      const result = parseCSV(content);
      
      expect(result).toEqual([['']]);
    });

    it('should handle content with only whitespace', () => {
      const content = '   \n   ';
      const result = parseCSV(content);
      
      // After trim(), whitespace-only content becomes empty, resulting in single empty array
      expect(result).toEqual([['']]);
    });

    it('should handle Finnish characters (Ä, Ö)', () => {
      const content = 'Ä,Ö,A\nÄ,Ö,Ä';
      const result = parseCSV(content);
      
      expect(result).toEqual([
        ['Ä', 'Ö', 'A'],
        ['Ä', 'Ö', 'Ä'],
      ]);
    });

    it('should handle typical crossword solution matrix', () => {
      const content = `H,E,L,L,O
A,#,L,#,N
P,L,A,Y,E
P,#,#,#,#
Y,E,S,#,#`;
      
      const result = parseCSV(content);
      
      expect(result).toHaveLength(5);
      expect(result[0]).toEqual(['H', 'E', 'L', 'L', 'O']);
      expect(result[1][1]).toBe('#');
      expect(result[4]).toEqual(['Y', 'E', 'S', '#', '#']);
    });
  });
});
