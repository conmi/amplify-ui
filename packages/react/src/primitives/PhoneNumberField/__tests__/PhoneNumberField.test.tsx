import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Flex } from '../../Flex';
import { Button } from '../../Button';
import { ComponentClassName } from '@aws-amplify/ui';

import { PhoneNumberField } from '../PhoneNumberField';

const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
});

describe('PhoneNumberField primitive', () => {
  beforeEach(() => {
    onSubmit.mockClear();
  });

  const setup = async ({
    defaultDialCode = '+1',
    label = 'Phone Number',
    ...rest
  }) => {
    render(
      <PhoneNumberField
        defaultDialCode={defaultDialCode}
        label={label}
        {...rest}
      />
    );

    return {
      phoneInput: await screen.findByRole('textbox', {
        name: /phone number/i,
      }),
      dialCodeSelector: await screen.findByRole('combobox'),
    };
  };

  const ReadOnlyFormTest = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dialCodeRef = React.useRef<HTMLSelectElement>(null);

    return (
      <Flex as="form" onSubmit={onSubmit}>
        <PhoneNumberField
          defaultDialCode="+40"
          defaultValue="1234567"
          label="Read Only"
          name="read_only_phone"
          ref={inputRef}
          dialCodeRef={dialCodeRef}
          isReadOnly
        />
        <Button type="submit">Submit</Button>
      </Flex>
    );
  };

  it('should forward ref and countryCodeRef to DOM elements', async () => {
    const ref = React.createRef<HTMLInputElement>();
    const dialCodeRef = React.createRef<HTMLSelectElement>();
    await setup({ ref, dialCodeRef });

    await screen.findByRole('textbox');
    expect(ref.current?.nodeName).toBe('INPUT');
    expect(dialCodeRef.current?.nodeName).toBe('SELECT');
  });

  it('should render a country code selector with an accessible role', async () => {
    const { dialCodeSelector } = await setup({});

    expect(dialCodeSelector).toBeDefined();
  });

  it('should render a country code selector with an accessible label', async () => {
    const { dialCodeSelector } = await setup({});

    expect(dialCodeSelector).toBeDefined();
  });

  it('should render a phone input field with an accessible role', async () => {
    const { phoneInput } = await setup({});

    expect(phoneInput).toBeDefined();
  });

  it('should render a phone input field with an accessible role (two?)', async () => {
    await setup({});
    const phoneInput = await screen.findByLabelText(/phone number/i);

    expect(phoneInput).toBeDefined();
  });

  it('should use a specified defaultCountryCode', async () => {
    const defaultDialCode = '+7';
    const { dialCodeSelector } = await setup({ defaultDialCode });

    expect(dialCodeSelector).toHaveValue(defaultDialCode);
  });

  it('should always use type "tel"', async () => {
    const { phoneInput } = await setup({});

    expect(phoneInput).toHaveAttribute('type', 'tel');
  });

  it('should have "tel-national" as the default autocomplete attribute', async () => {
    const { phoneInput } = await setup({});

    expect(phoneInput).toHaveAttribute('autocomplete', 'tel-national');
  });

  it('should render classname for PhoneNumberField', async () => {
    const className = 'test-class-name';
    const testId = 'PhoneNumberFieldTestId';
    await setup({ className, testId });
    const phoneInput = await screen.findByTestId(testId);

    expect(phoneInput).toHaveClass(className);
    expect(phoneInput).toHaveClass(ComponentClassName.PhoneNumberField);
  });

  it('should be able to set a size', async () => {
    const { dialCodeSelector, phoneInput } = await setup({
      size: 'large',
    });

    expect(phoneInput).toHaveClass(`${ComponentClassName.Input}--large`);
    expect(dialCodeSelector).toHaveClass(`${ComponentClassName.Select}--large`);
  });

  it('should render size classes for PhoneNumberField', async () => {
    render(
      <div>
        <PhoneNumberField size="small" testId="small" label="small" />
        <PhoneNumberField size="large" testId="large" label="large" />
      </div>
    );

    const small = await screen.findByTestId('small');
    const large = await screen.findByTestId('large');

    expect(small.classList).toContain(`${ComponentClassName['Field']}--small`);
    expect(large.classList).toContain(`${ComponentClassName['Field']}--large`);
  });

  it('should be able to set a variation', async () => {
    const { dialCodeSelector, phoneInput } = await setup({
      variation: 'quiet',
    });

    expect(phoneInput).toHaveClass(`${ComponentClassName.Input}--quiet`);
    expect(dialCodeSelector).toHaveClass(`${ComponentClassName.Select}--quiet`);
  });

  it('should fire onChange handler when phone input field is changed', async () => {
    const onChange = jest.fn();
    const { phoneInput } = await setup({ onChange });
    await act(async () => {
      await userEvent.type(phoneInput, '1');
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('should fire onInput handler when phone input field is changed', async () => {
    const onInput = jest.fn();
    const { phoneInput } = await setup({ onInput });
    await act(async () => {
      await userEvent.type(phoneInput, '1');
    });

    expect(onInput).toHaveBeenCalled();
  });

  it('should fire onCountryCodeChange handler when phone input field is changed', async () => {
    const onDialCodeChange = jest.fn();
    const { dialCodeSelector } = await setup({ onDialCodeChange });
    await act(async () => {
      await userEvent.selectOptions(dialCodeSelector, '+7');
    });

    expect(onDialCodeChange).toHaveBeenCalled();
  });

  /*
    Since <select> elements do not support the `readonly` html attribute, it is suggested to use the `disabled` html attribute 
    so that a screen reader will announce something to the user about the interactivity of the options list ( https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly)
  */
  it('should set aria-disabled="true" when the isReadOnly prop is passed, and disable all the select options', async () => {
    const { dialCodeSelector } = await setup({ isReadOnly: true });

    expect(dialCodeSelector).toHaveAttribute('aria-disabled', 'true');

    dialCodeSelector.querySelectorAll('option').forEach((option) => {
      expect(option).toHaveAttribute('disabled');
    });
  });

  it('should still submit the form values when the isReadOnly prop is passed', async () => {
    const { container } = render(<ReadOnlyFormTest />);

    const button = container.getElementsByTagName('button')[0];
    await act(async () => {
      await userEvent.click(button);
    });
    expect(onSubmit).toHaveBeenCalled();
  });

  describe('Using Dial Code', () => {
    const dialCodeSetup = async ({
      defaultDialCode = '+1',
      label = 'Phone Number',
      dialCodeLabel = 'dial code',
      ...rest
    }) => {
      render(
        <PhoneNumberField
          defaultDialCode={defaultDialCode}
          label={label}
          dialCodeLabel={dialCodeLabel}
          {...rest}
        />
      );

      return {
        phoneInput: await screen.findByRole('textbox', {
          name: /phone number/i,
        }),
        dialCodeSelector: await screen.findByRole('combobox', {
          name: /dial code/i,
        }),
      };
    };

    const DialCodeReadOnlyFormTest = () => {
      const inputRef = React.useRef<HTMLInputElement>(null);
      const dialCodeRef = React.useRef<HTMLSelectElement>(null);

      return (
        <Flex as="form" onSubmit={onSubmit}>
          <PhoneNumberField
            defaultDialCode="+40"
            defaultValue="1234567"
            label="Read Only"
            name="read_only_phone"
            ref={inputRef}
            dialCodeRef={dialCodeRef}
            isReadOnly
          />
          <Button type="submit">Submit</Button>
        </Flex>
      );
    };

    it('should forward ref and dialCodeRef to DOM elements', async () => {
      const ref = React.createRef<HTMLInputElement>();
      const dialCodeRef = React.createRef<HTMLSelectElement>();
      await dialCodeSetup({ ref, dialCodeRef });

      await screen.findByRole('textbox');
      expect(ref.current?.nodeName).toBe('INPUT');
      expect(dialCodeRef.current?.nodeName).toBe('SELECT');
    });

    it('should render a country code selector with an accessible role', async () => {
      const { dialCodeSelector } = await dialCodeSetup({});

      expect(dialCodeSelector).toBeDefined();
    });

    it('should render a country code selector with an accessible label', async () => {
      const { dialCodeSelector } = await dialCodeSetup({});

      expect(dialCodeSelector).toBeDefined();
    });

    it('should render a phone input field with an accessible role', async () => {
      const { phoneInput } = await dialCodeSetup({});

      expect(phoneInput).toBeDefined();
    });

    it('should render a phone input field with an accessible role (two?)', async () => {
      await dialCodeSetup({});
      const phoneInput = await screen.findByLabelText(/phone number/i);

      expect(phoneInput).toBeDefined();
    });

    it('should use a specified defaultDialCode', async () => {
      const defaultDialCode = '+7';
      const { dialCodeSelector } = await dialCodeSetup({ defaultDialCode });

      expect(dialCodeSelector).toHaveValue(defaultDialCode);
    });

    it('should always use type "tel"', async () => {
      const { phoneInput } = await dialCodeSetup({});

      expect(phoneInput).toHaveAttribute('type', 'tel');
    });

    it('should have "tel-national" as the default autocomplete attribute', async () => {
      const { phoneInput } = await dialCodeSetup({});

      expect(phoneInput).toHaveAttribute('autocomplete', 'tel-national');
    });

    it('should render classname for PhoneNumberField', async () => {
      const className = 'test-class-name';
      const testId = 'PhoneNumberFieldTestId';
      await dialCodeSetup({ className, testId });
      const phoneInput = await screen.findByTestId(testId);

      expect(phoneInput).toHaveClass(className);
      expect(phoneInput).toHaveClass(ComponentClassName.PhoneNumberField);
    });

    it('should be able to set a size', async () => {
      const { dialCodeSelector, phoneInput } = await dialCodeSetup({
        size: 'large',
      });
      expect(phoneInput).toHaveClass(`${ComponentClassName.Input}--large`);
      expect(dialCodeSelector).toHaveClass(
        `${ComponentClassName.Select}--large`
      );
    });

    it('should be able to set a variation', async () => {
      const { dialCodeSelector, phoneInput } = await dialCodeSetup({
        variation: 'quiet',
      });
      expect(phoneInput).toHaveClass(`${ComponentClassName.Input}--quiet`);
      expect(dialCodeSelector).toHaveClass(
        `${ComponentClassName.Select}--quiet`
      );
    });

    it('should fire onChange handler when phone input field is changed', async () => {
      const onChange = jest.fn();
      const { phoneInput } = await dialCodeSetup({ onChange });
      await act(async () => {
        await userEvent.type(phoneInput, '1');
      });

      expect(onChange).toHaveBeenCalled();
    });

    it('should fire onInput handler when phone input field is changed', async () => {
      const onInput = jest.fn();
      const { phoneInput } = await dialCodeSetup({ onInput });
      await act(async () => {
        await userEvent.type(phoneInput, '1');
      });

      expect(onInput).toHaveBeenCalled();
    });

    it('should fire onDialCodeChange handler when phone input field is changed', async () => {
      const onDialCodeChange = jest.fn();
      const { dialCodeSelector } = await dialCodeSetup({ onDialCodeChange });
      await act(async () => {
        await userEvent.selectOptions(dialCodeSelector, '+7');
      });

      expect(onDialCodeChange).toHaveBeenCalled();
    });

    /*
      Since <select> elements do not support the `readonly` html attribute, it is suggested to use the `disabled` html attribute 
      so that a screen reader will announce something to the user about the interactivity of the options list ( https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly)
    */
    it('should set aria-disabled="true" when the isReadOnly prop is passed, and disable all the select options', async () => {
      const { dialCodeSelector } = await dialCodeSetup({ isReadOnly: true });

      expect(dialCodeSelector).toHaveAttribute('aria-disabled', 'true');

      dialCodeSelector.querySelectorAll('option').forEach((option) => {
        expect(option).toHaveAttribute('disabled');
      });
    });

    it('should still submit the form values when the isReadOnly prop is passed', async () => {
      const { container } = render(<DialCodeReadOnlyFormTest />);

      const button = container.getElementsByTagName('button')[0];
      await act(async () => {
        await userEvent.click(button);
      });
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  describe('formatting phone numbers', () => {
    it('should format phone number when dial code changes', async () => {
      const { phoneInput, dialCodeSelector } = await setup({});
      await act(async () => {
        await userEvent.type(phoneInput, '1234567890');
      });
      await act(async () => {
        await userEvent.selectOptions(dialCodeSelector, '+1');
      });
      expect(phoneInput).toHaveValue('(123) 456-7890');
    });

    it('should format phone number when value is initially provided', async () => {
      const { phoneInput } = await setup({ defaultValue: '1234567890' });
      expect(phoneInput).toHaveValue('(123) 456-7890');
    });

    it('should handle non-numeric characters in the input', async () => {
      const { phoneInput } = await setup({});
      await act(async () => {
        await userEvent.type(phoneInput, '1a2b3c4d567890');
      });
      expect(phoneInput).toHaveValue('(123) 456-7890');
    });

    it('should handle empty input value', async () => {
      const { phoneInput } = await setup({});
      await act(async () => {
        await userEvent.clear(phoneInput);
      });
      expect(phoneInput).toHaveValue('');
    });
  });
});
