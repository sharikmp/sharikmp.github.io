import { Page, Locator, expect } from '@playwright/test';
import { waitForVisible } from './waitForVisible'; // Import waitForVisible function

export class UIAction {
  constructor(private page: Page) {}

  /** Private helper function to get a Locator object */
  private getLocator(selectorOrLocator: Locator | string): Locator {
    return typeof selectorOrLocator === 'string' ? this.page.locator(selectorOrLocator) : selectorOrLocator;
  }

  /** Fill input fields ensuring visibility and verifying input */
  async fillInput(selectorOrLocator: Locator | string, text: string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.fill(text);
    await expect(locator).toHaveValue(text); // Verification step
  }

  /** Click an element ensuring it is visible and stable */
  async click(selectorOrLocator: Locator | string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.click();
    await expect(locator).toBeVisible(); // Ensuring the element is still visible post-click
  }

  /** Select an option from a dropdown and verify selection */
  async selectOption(selectorOrLocator: Locator | string, value: string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.selectOption(value);
    await expect(locator).toHaveValue(value);
  }

  /** Get text from all matching elements as an array */
  async getAllTexts(selectorOrLocator: Locator | string): Promise<string[]> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    const elements = await locator.all();
    const texts = await Promise.all(elements.map(async (el) => await el.textContent() || ''));
    return texts;
  }

  /** Set checkbox checked/unchecked and verify state */
  async setChecked(selectorOrLocator: Locator | string, checked: boolean): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.setChecked(checked);
    await expect(locator).toBeChecked({ checked });
  }

  /** Hover over an element */
  async hover(selectorOrLocator: Locator | string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.hover();
    await expect(locator).toBeVisible();
  }

  /** Type text character by character and verify input */
  async type(selectorOrLocator: Locator | string, text: string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.type(text);
    await expect(locator).toHaveValue(text);
  }

  /** Press a key */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /** Upload file to input field and verify */
  async uploadFile(selectorOrLocator: Locator | string, filePath: string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.setInputFiles(filePath);
    const uploadedFiles = await locator.evaluate((el: HTMLInputElement) => el.files?.[0]?.name || '');
    await expect(uploadedFiles).not.toBe('');
  }

  /** Focus on an element */
  async focus(selectorOrLocator: Locator | string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.focus();
    await expect(locator).toBeFocused();
  }

  /** Move mouse to an element */
  async moveMouse(selectorOrLocator: Locator | string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    const box = await locator.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
  }

  /** Drag an element to another location and verify */
  async dragAndDrop(sourceSelectorOrLocator: Locator | string, targetSelectorOrLocator: Locator | string): Promise<void> {
    const source = this.getLocator(sourceSelectorOrLocator);
    const target = this.getLocator(targetSelectorOrLocator);
    await waitForVisible(this.page, source);
    await waitForVisible(this.page, target);
    await source.dragTo(target);
    await expect(source).not.toBeVisible(); // Assuming element is moved out of view
  }

  /** Scroll to an element */
  async scrollTo(selectorOrLocator: Locator | string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible();
  }

  /** Simulate a tap action (for mobile testing) */
  async tap(selectorOrLocator: Locator | string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.tap();
    await expect(locator).toBeVisible();
  }

  /** Copy text to clipboard */
  async copyToClipboard(text: string): Promise<void> {
    await this.page.evaluate((text) => navigator.clipboard.writeText(text), text);
    const clipboardText = await this.page.evaluate(() => navigator.clipboard.readText());
    await expect(clipboardText).toBe(text);
  }

  /** Capture a screenshot of an element */
  async captureElementScreenshot(selectorOrLocator: Locator | string, path: string): Promise<void> {
    const locator = this.getLocator(selectorOrLocator);
    await waitForVisible(this.page, locator);
    await locator.screenshot({ path });
  }
}
