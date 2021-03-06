﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC
{
    public partial class UserDefinedFunctionFactory
    {
        private UserDefinedFunctionFactory() { }

        #region Equality Predicate
        public static bool Equal(string a, string b)
        {
            if (a == null && b == null)
                return true;
            return a.Equals(b);
        }
        #endregion

        #region Arithmetic functions
        public static double Add(params double[] arr)
        {
            return arr.Sum();
        }
        public static double Substract(int a, int b)
        {
            return a - b;
        }
        public static double Multiply(params double[] arr)
        {
            double result = 1;
            foreach (var ele in arr)
            {
                result *= ele;
                if (result == 0) break;
            }
            return result;
        }
        public static double Divide(double a, double b)
        {
            return a/b;
        }
        public static int Mod(int a, int b)
        {
            return a % b;
        }
        public static double Abs(double a)
        {
            return Math.Abs(a);
        }
        public static double Round(double a)
        {
            return Math.Round(a);
        }
        public static double Floor(double a)
        {
            return Math.Floor(a);
        }
        #endregion

        #region Numeric comparison functions

        public static bool GreaterThan(double a, double b)
        {
            return a > b;
        }
        public static bool GreaterThanOrEqual(double a, double b)
        {
            return a >= b;
        }
        public static bool LessThan(double a, double b)
        {
            return a < b;
        }
        public static bool LessThanOrEqual(double a, double b)
        {
            return a <= b;
        }
        #endregion

        public static bool Or(params string[] arr)
        {
            bool result = false;
            foreach (var c in arr)
            {
                result = c == "True" ? true : false;
                if (result) break;
            }
            return result;
        }

        public static bool And(params string[] arr)
        {
            bool result = false;
            foreach (var c in arr)
            {
                result = c == "False" ? false : true;
                if (!result) break;
            }
            return result;
        }

        public void Function1(int a, int b)
        { }

        public void Function2(string s)
        { }

    }
}
