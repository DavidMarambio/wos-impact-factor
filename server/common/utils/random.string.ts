export function randomString(numberOfCharacter: number): string {
    return Array(numberOfCharacter).fill(1, 1, 30).map(n => (Math.random() * 36 | 0).toString(36)).join('');
}