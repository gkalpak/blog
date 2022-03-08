import 'jasmine';

import { marked } from 'marked';
import { pictureExtension } from './picture';

describe('picture', () => {
    describe('pictureExtension', () => {
        marked.use(pictureExtension);

        it('renders an image with a single source as an `<img />`', () => {
            expect(marked(`![alt](/foo.png)`))
                .toContain(`<img src="/foo.png" alt="alt">`);
        });

        it('renders an image with multiple sources as a `<picture />`', () => {
            expect(marked(`![alt](/foo.avif)(/foo.webp)(/foo.png)`)).toContain(`
<picture>
    <source srcset="/foo.avif" type="image/avif" />
    <source srcset="/foo.webp" type="image/webp" />
    <img srcset="/foo.png" alt="alt" />
</picture>
            `.trim())
        });

        it('renders an image with a multiline alt', () => {
            const html = marked(`
![this is a
very long
alt text](/foo.webp)(/foo.png)
            `.trim());
            expect(html).toContain(`alt="this is a very long alt text"`);
        });

        it('throws an error when given a source with no alt', () => {
            expect(() => marked(`![](/foo.png)`))
                .toThrowError(/No alt: `!\[\]\(\/foo\.png\)`/);
        });

        it('escapes alt text with quotes', () => {
            const html = marked(
                `![this is "alt" text with "quotes"!](/foo.webp)(/foo.png)`);
            expect(html).toContain(
                `alt="this is &quot;alt&quot; text with &quot;quotes&quot;!"`);
        });

        it('trims leading and trailing alt whitespace', () => {
            const html = marked(`
![
this is some
multiline alt text
with leading and trailing newlines
](/foo.webp)(/foo.png)
            `.trim());

            expect(html).toContain(
                `alt="this is some multiline alt text with leading and trailing newlines"`);
        });

        it('throws an error when given no sources', () => {
            expect(() => marked(`![alt]`))
                .toThrowError(/No sources: `!\[alt\]`/);
        });

        it('throws an error when given a source with an unknown MIME type', () => {
            expect(() => marked(`![alt](/foo.doesnotexist)(/foo.png)`))
                .toThrow();
        });

        it('throws an error when given a source without an extension', () => {
            expect(() => marked(`![alt](/foowithoutextension)(/foo.png)`))
                .toThrow();
        });
    });
});
